import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation, ConsultationStatus } from './entities/consultation.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
  ) { }

  async create(
    createConsultationDto: CreateConsultationDto,
  ): Promise<ApiResponse<Consultation>> {
    try {
      console.log('📋 Received consultation DTO:', createConsultationDto);

      // Test database connection first
      try {
        const count = await this.consultationRepository.count();
        console.log(
          '📋 Database connection test - existing consultations count:',
          count,
        );
      } catch (dbError) {
        console.error('📋 Database connection error:', dbError);
        return {
          success: false,
          message: 'Database connection failed',
          error: dbError.message,
        };
      }

      // Parse date and time properly
      const consultationDate = new Date(createConsultationDto.date);
      const consultationTime = new Date(
        `${createConsultationDto.date}T${createConsultationDto.time}`,
      );

      console.log('📋 Parsed dates:', { consultationDate, consultationTime });

      const prepared: Partial<Consultation> = {
        user_id: 1, // Default user_id for now - should be from auth context
        full_name: createConsultationDto.full_name,
        phone: createConsultationDto.phone,
        consult_type: createConsultationDto.consult_type,
        date: consultationDate,
        time: consultationTime,
      };

      console.log('📋 Prepared consultation data:', prepared);

      const newConsult = this.consultationRepository.create(prepared);
      console.log('📋 Created consultation entity:', newConsult);

      const saved = await this.consultationRepository.save(newConsult);
      console.log('📋 Saved consultation:', saved);

      return {
        success: true,
        message: 'Consultation created successfully',
        data: saved,
      };
    } catch (error) {
      console.error('Consultation creation error:', error);
      return {
        success: false,
        message: 'Failed to create consultation',
        error: error.message,
      };
    }
  }

  async findAll(): Promise<ApiResponse<Consultation[]>> {
    try {
      console.log('📋 Fetching all consultations...');
      const consultations = await this.consultationRepository.find();
      console.log('📋 Found consultations:', consultations);
      return {
        success: true,
        message: 'Consultations retrieved successfully',
        data: consultations,
      };
    } catch (error) {
      console.error('📋 Error fetching consultations:', error);
      return {
        success: false,
        message: 'Failed to retrieve consultations',
        error: error.message,
      };
    }
  }

  async testConnection(): Promise<
    ApiResponse<{ message: string; count: number }>
  > {
    try {
      console.log('📋 Testing database connection...');
      const count = await this.consultationRepository.count();
      console.log('📋 Database connection successful, count:', count);
      return {
        success: true,
        message: 'Database connection successful',
        data: { message: 'Connected to consultations table', count },
      };
    } catch (error) {
      console.error('📋 Database connection test failed:', error);
      return {
        success: false,
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }

  async findOne(id: number): Promise<ApiResponse<Consultation>> {
    try {
      const consultation = await this.consultationRepository.findOne({
        where: { id },
      });
      if (!consultation)
        throw new NotFoundException(`Consultation with id ${id} not found`);
      return {
        success: true,
        message: 'Consultation found successfully',
        data: consultation,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Failed to find consultation with id ${id}`,
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    updateConsultationDto: UpdateConsultationDto,
  ): Promise<ApiResponse<Consultation>> {
    try {
      const consultation = await this.consultationRepository.findOne({
        where: { id },
      });
      if (!consultation)
        throw new NotFoundException(`Consultation with id ${id} not found`);

      const prepared: Partial<Consultation> = {
        full_name: updateConsultationDto.full_name ?? consultation.full_name,
        phone: updateConsultationDto.phone ?? consultation.phone,
      };
      const saved = await this.consultationRepository.save({
        ...consultation,
        ...prepared,
      });
      return {
        success: true,
        message: 'Consultation updated successfully',
        data: saved,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Failed to update consultation with id ${id}`,
        error: error.message,
      };
    }
  }
  async updateStatus(id: number, status: ConsultationStatus): Promise<ApiResponse<Consultation>> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
    });
    if (!consultation)
      throw new NotFoundException(`Consultation with id ${id} not found`);
    const updatedStatus = await this.consultationRepository.save({
      ...consultation,
      status
    })
    return {
      success: true,
      message: 'Consultation updated successfully',
      data: updatedStatus,
    };
  }
  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const consultation = await this.consultationRepository.findOne({
        where: { id },
      });
      if (!consultation)
        throw new NotFoundException(`Consultation with id ${id} not found`);
      await this.consultationRepository.remove(consultation);
      return {
        success: true,
        message: 'Consultation deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Failed to delete consultation with id ${id}`,
        error: error.message,
      };
    }
  }
}
