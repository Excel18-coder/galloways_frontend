import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async uploadResource(
    file: Express.Multer.File,
    category: string,
    description?: string,
  ): Promise<Resource> {
    // Upload to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(file);

    // Create resource record
    const resource = this.resourceRepository.create({
      originalName: file.originalname,
      filename: uploadResult.filename,
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      category: category || 'general',
      description: description || '',
      fileType: file.mimetype,
      size: file.size,
      downloads: 0,
    });

    return await this.resourceRepository.save(resource);
  }

  async getAllResources(category?: string): Promise<Resource[]> {
    const query = this.resourceRepository.createQueryBuilder('resource');

    if (category && category !== 'all') {
      query.where('resource.category = :category', { category });
    }

    query.orderBy('resource.createdAt', 'DESC');

    return await query.getMany();
  }

  async getResourceById(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }

  async incrementDownloads(id: string): Promise<void> {
    await this.resourceRepository.increment({ id }, 'downloads', 1);
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.getResourceById(id);

    // Delete from Cloudinary if publicId exists
    if (resource.publicId) {
      try {
        await this.cloudinaryService.deleteFile(resource.publicId);
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
      }
    }

    await this.resourceRepository.remove(resource);
  }

  async getStats(): Promise<any> {
    const totalResources = await this.resourceRepository.count();
    const totalDownloads = await this.resourceRepository
      .createQueryBuilder('resource')
      .select('SUM(resource.downloads)', 'sum')
      .getRawOne();

    const categoryStats = await this.resourceRepository
      .createQueryBuilder('resource')
      .select('resource.category', 'category')
      .addSelect('COUNT(resource.id)', 'count')
      .groupBy('resource.category')
      .getRawMany();

    return {
      totalResources,
      totalDownloads: parseInt(totalDownloads.sum) || 0,
      totalSize: 0, // TODO: Calculate total size
      categoryStats: categoryStats || [],
    };
  }

  // Template Management Methods
  private getTemplatesDirectory(): string {
    return path.join(__dirname, 'templates');
  }

  async listTemplates(): Promise<any[]> {
    const templatesDir = this.getTemplatesDirectory();

    try {
      const files = await fs.readdir(templatesDir);
      const templates = await Promise.all(
        files
          .filter((file) => file.endsWith('.html'))
          .map(async (file) => {
            const filePath = path.join(templatesDir, file);
            const stats = await fs.stat(filePath);
            const displayName = file
              .replace('.html', '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

            // Determine template type and category
            const type = file.includes('fillable') ? 'fillable' : 'standard';
            const category = file.split('-')[0];

            return {
              name: file,
              displayName,
              size: stats.size,
              type,
              category,
              lastModified: stats.mtime,
            };
          }),
      );

      return templates.sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      );
    } catch (error) {
      throw new NotFoundException('Templates directory not found');
    }
  }

  async getTemplate(templateName: string): Promise<string | Buffer> {
    const templatesDir = this.getTemplatesDirectory();
    const filePath = path.join(templatesDir, templateName);

    try {
      const content = await fs.readFile(filePath);
      return content;
    } catch (error) {
      throw new NotFoundException(`Template "${templateName}" not found`);
    }
  }

  async updateTemplate(templateName: string, content: string): Promise<void> {
    const templatesDir = this.getTemplatesDirectory();
    const filePath = path.join(templatesDir, templateName);

    try {
      // Check if template exists
      await fs.access(filePath);
      // Write new content
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new NotFoundException(`Template "${templateName}" not found`);
    }
  }

  async convertTemplateToPdf(templateName: string): Promise<Buffer> {
    const htmlContent = await this.getTemplate(templateName);
    const htmlString =
      typeof htmlContent === 'string'
        ? htmlContent
        : htmlContent.toString('utf-8');

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          bufferPages: true,
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Extract text content from HTML (simple parsing)
        const textContent = htmlString
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<\/div>/gi, '\n')
          .replace(/<\/h[1-6]>/gi, '\n\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();

        // Extract title if present
        const titleMatch = htmlString.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch
          ? titleMatch[1].trim()
          : templateName.replace('.html', '');

        // Add title
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text(title, { align: 'center' });
        doc.moveDown(2);

        // Add content
        doc.fontSize(12).font('Helvetica').text(textContent, {
          align: 'left',
          lineGap: 5,
        });

        // Add footer with page numbers
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(10)
            .text(`Page ${i + 1} of ${pages.count}`, 50, doc.page.height - 50, {
              align: 'center',
            });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
