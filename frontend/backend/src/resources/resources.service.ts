import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
