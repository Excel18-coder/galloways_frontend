import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOutsourcingRequestDto } from './dto/create-outsourcing_request.dto';
import { UpdateOutsourcingRequestDto } from './dto/update-outsourcing_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutsourcingRequest } from './entities/outsourcing_request.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class OutsourcingRequestsService {
  constructor(
    @InjectRepository(OutsourcingRequest)
    private readonly outsourcingRepository: Repository<OutsourcingRequest>,
  ) { }

  async create(
    createOutsourcingRequestDto: CreateOutsourcingRequestDto,
  ): Promise<ApiResponse<OutsourcingRequest>> {
    try {
      const newItem = this.outsourcingRepository.create(createOutsourcingRequestDto);
      const saved = await this.outsourcingRepository.save(newItem);
      return { success: true, message: 'Outsourcing request created successfully', data: saved };
    } catch (error) {
      return { success: false, message: 'Failed to create outsourcing request', error: error.message };
    }
  }

  async findAll(): Promise<ApiResponse<OutsourcingRequest[]>> {
    try {
      const items = await this.outsourcingRepository.find({ order: { created_at: 'DESC' } });
      return { success: true, message: 'Outsourcing requests retrieved successfully', data: items };
    } catch (error) {
      return { success: false, message: 'Failed to retrieve outsourcing requests', error: error.message };
    }
  }

  async findOne(id: number): Promise<ApiResponse<OutsourcingRequest>> {
    try {
      const item = await this.outsourcingRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Outsourcing request with id ${id} not found`);
      return { success: true, message: 'Outsourcing request found successfully', data: item };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to find outsourcing request with id ${id}`, error: error.message };
    }
  }

  async update(
    id: number,
    updateOutsourcingRequestDto: UpdateOutsourcingRequestDto,
  ): Promise<ApiResponse<OutsourcingRequest>> {
    try {
      const item = await this.outsourcingRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Outsourcing request with id ${id} not found`);
      const saved = await this.outsourcingRepository.save({ ...item, ...updateOutsourcingRequestDto });
      return { success: true, message: 'Outsourcing request updated successfully', data: saved };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to update outsourcing request with id ${id}`, error: error.message };
    }
  }

  async updateStatus(id: number, status: string): Promise<ApiResponse<OutsourcingRequest>> {
    try {
      const item = await this.outsourcingRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Outsourcing request with id ${id} not found`);
      item.status = status;
      const saved = await this.outsourcingRepository.save(item);
      return { success: true, message: 'Outsourcing request status updated successfully', data: saved };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to update status of outsourcing request with id ${id}`, error: error.message };
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const item = await this.outsourcingRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Outsourcing request with id ${id} not found`);
      await this.outsourcingRepository.remove(item);
      return { success: true, message: 'Outsourcing request deleted successfully', data: null };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return { success: false, message: `Failed to delete outsourcing request with id ${id}`, error: error.message };
    }
  }
}
