import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiasporaRequestDto } from './dto/create-diaspora_request.dto';
import { UpdateDiasporaRequestDto } from './dto/update-diaspora_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiasporaRequest } from './entities/diaspora_request.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class DiasporaRequestsService {
  constructor(
    @InjectRepository(DiasporaRequest)
    private readonly diasporaRepository: Repository<DiasporaRequest>,
  ) { }

  async create(
    createDiasporaRequestDto: CreateDiasporaRequestDto,
  ): Promise<ApiResponse<DiasporaRequest>> {
    try {
      const newItem = this.diasporaRepository.create(createDiasporaRequestDto);
      const saved = await this.diasporaRepository.save(newItem);
      return { success: true, message: 'Diaspora request created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create diaspora request', error: error.message };
    }
  }

  async findAll(): Promise<ApiResponse<DiasporaRequest[]>> {
    try {
      const items = await this.diasporaRepository.find({ order: { created_at: 'DESC' } });
      return { success: true, message: 'Diaspora requests retrieved successfully', data: items };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve diaspora requests', error: error.message };
    }
  }

  async findOne(id: number): Promise<ApiResponse<DiasporaRequest>> {
    try {
      const item = await this.diasporaRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Diaspora request with id ${id} not found`);
      return { success: true, message: 'Diaspora request found successfully', data: item };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to find diaspora request with id ${id}`, error: error.message };
    }
  }

  async update(
    id: number,
    updateDiasporaRequestDto: UpdateDiasporaRequestDto,
  ): Promise<ApiResponse<DiasporaRequest>> {
    try {
      const item = await this.diasporaRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Diaspora request with id ${id} not found`);
      const saved = await this.diasporaRepository.save({ ...item, ...updateDiasporaRequestDto });
      return { success: true, message: 'Diaspora request updated successfully', data: saved };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to update diaspora request with id ${id}`, error: error.message };
    }
  }
  async updateStatus(id: number, status: string): Promise<ApiResponse<DiasporaRequest>> {
    try {
      const item = await this.diasporaRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Diaspora request with id ${id} not found`);
      item.status = status;
      const saved = await this.diasporaRepository.save(item);
      return { success: true, message: 'Diaspora request status updated successfully', data: saved };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to update status of diaspora request with id ${id}`, error: error.message };
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const item = await this.diasporaRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Diaspora request with id ${id} not found`);
      await this.diasporaRepository.remove(item);
      return { success: true, message: 'Diaspora request deleted successfully', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to delete diaspora request with id ${id}`, error: error.message };
    }
  }
}
