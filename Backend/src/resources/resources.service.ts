import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
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

  async getAvailableTemplates(): Promise<any[]> {
    const templatesDir = path.join(__dirname, 'templates');

    try {
      const files = fs.readdirSync(templatesDir);
      const templates = files
        .filter((file) => file.endsWith('.html'))
        .map((file) => {
          const stats = fs.statSync(path.join(templatesDir, file));
          return {
            name: file,
            displayName: file.replace(/-/g, ' ').replace('.html', ''),
            size: stats.size,
            type: file.includes('fillable') ? 'fillable' : 'template',
            category: file.includes('letterhead')
              ? 'letterhead'
              : file.includes('invoice')
                ? 'invoice'
                : file.includes('receipt')
                  ? 'receipt'
                  : 'other',
            lastModified: stats.mtime,
          };
        });

      return templates;
    } catch (error) {
      console.error('Error reading templates directory:', error);
      return [];
    }
  }

  async getTemplate(templateName: string): Promise<string> {
    const templatesDir = path.join(__dirname, 'templates');
    const templatePath = path.join(templatesDir, templateName);

    // Security check: ensure the path is within templates directory
    if (!templatePath.startsWith(templatesDir)) {
      throw new NotFoundException('Invalid template name');
    }

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template '${templateName}' not found`);
    }

    try {
      return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      throw new NotFoundException(
        `Failed to read template '${templateName}': ${error.message}`,
      );
    }
  }

  async updateTemplate(templateName: string, content: string): Promise<void> {
    const templatesDir = path.join(__dirname, 'templates');
    const templatePath = path.join(templatesDir, templateName);

    // Security check: ensure the path is within templates directory
    if (!templatePath.startsWith(templatesDir)) {
      throw new NotFoundException('Invalid template name');
    }

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(`Template '${templateName}' not found`);
    }

    try {
      // Create backup before updating
      const backupPath = path.join(
        templatesDir,
        `${templateName}.backup.${Date.now()}`,
      );
      fs.copyFileSync(templatePath, backupPath);

      // Write new content
      fs.writeFileSync(templatePath, content, 'utf8');
    } catch (error) {
      throw new NotFoundException(
        `Failed to update template '${templateName}': ${error.message}`,
      );
    }
  }
}
