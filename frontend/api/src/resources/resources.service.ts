import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    try {
      const resource = this.resourceRepository.create(createResourceDto);
      return await this.resourceRepository.save(resource);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create resource');
    }
  }

  async findAll(): Promise<Resource[]> {
    try {
      return await this.resourceRepository.find({
        where: { isActive: true },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch resources');
    }
  }

  async findOne(id: number): Promise<Resource> {
    try {
      const resource = await this.resourceRepository.findOne({
        where: { id, isActive: true }
      });
      
      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }
      
      return resource;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch resource');
    }
  }

  async update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    try {
      const resource = await this.findOne(id);
      
      const updatedResource = Object.assign(resource, updateResourceDto);
      return await this.resourceRepository.save(updatedResource);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update resource');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const resource = await this.findOne(id);
      
      // Soft delete by setting isActive to false
      resource.isActive = false;
      await this.resourceRepository.save(resource);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete resource');
    }
  }

  async hardDelete(id: number): Promise<void> {
    try {
      const resource = await this.resourceRepository.findOne({ where: { id } });
      
      if (!resource) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }

      // Delete physical file
      if (fs.existsSync(resource.path)) {
        fs.unlinkSync(resource.path);
      }

      // Delete database record
      await this.resourceRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to permanently delete resource');
    }
  }

  async getFileStream(id: number): Promise<{ stream: fs.ReadStream; resource: Resource }> {
    try {
      const resource = await this.findOne(id);
      
      if (!fs.existsSync(resource.path)) {
        throw new NotFoundException('File not found on disk');
      }

      const stream = fs.createReadStream(resource.path);
      return { stream, resource };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get file stream');
    }
  }

  async findByCategory(category: string): Promise<Resource[]> {
    try {
      return await this.resourceRepository.find({
        where: { category, isActive: true },
        order: { created_at: 'DESC' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch resources by category');
    }
  }

  async getStats(): Promise<any> {
    try {
      const totalResources = await this.resourceRepository.count({ where: { isActive: true } });
      const totalSize = await this.resourceRepository
        .createQueryBuilder('resource')
        .select('SUM(resource.size)', 'total')
        .where('resource.isActive = :isActive', { isActive: true })
        .getRawOne();

      const categoryStats = await this.resourceRepository
        .createQueryBuilder('resource')
        .select('resource.category', 'category')
        .addSelect('COUNT(*)', 'count')
        .addSelect('SUM(resource.size)', 'size')
        .where('resource.isActive = :isActive', { isActive: true })
        .groupBy('resource.category')
        .getRawMany();

      return {
        totalResources,
        totalSize: parseInt(totalSize?.total || '0'),
        categoryStats
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get resource statistics');
    }
  }
}