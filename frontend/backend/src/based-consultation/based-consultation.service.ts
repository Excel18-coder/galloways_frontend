import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBasedConsultationDto } from './dto/create-based-consultation.dto';
import { UpdateBasedConsultationDto } from './dto/update-based-consultation.dto';
import { BasedConsultation } from './entities/based-consultation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Define ApiResponse interface to match the pattern
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class BasedConsultationService {
  constructor(
    @InjectRepository(BasedConsultation)
    private readonly basedConsultationRepository: Repository<BasedConsultation>,
  ) { }

  // Create based consultation
  async create(
    createBasedConsultationDto: CreateBasedConsultationDto,
  ): Promise<ApiResponse<BasedConsultation>> {
    try {
      // Prepare the data for creation
      const preparedConsultation: Partial<BasedConsultation> = {
        ...createBasedConsultationDto,
        // Add any necessary transformations here
        // Example: Convert dates, stringify arrays/objects, etc.
        // consultation_date: new Date(createBasedConsultationDto.consultation_date),
        // supporting_documents: JSON.stringify(createBasedConsultationDto.supporting_documents),
      } as Partial<BasedConsultation>;

      const newConsultation = this.basedConsultationRepository.create(preparedConsultation);
      const savedConsultation = await this.basedConsultationRepository.save(newConsultation);

      return {
        success: true,
        message: 'Based consultation created successfully',
        data: savedConsultation,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create based consultation',
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating based consultation',
      };
    }
  }

  // Find all based consultations
  async findAll(): Promise<ApiResponse<BasedConsultation[]>> {
    try {
      const consultations = await this.basedConsultationRepository.find({
        // order: { created_at: 'DESC' }, // Adjust field name as needed
      });

      // If you need to parse any stringified data back to objects/arrays
      const processedConsultations = consultations.map((consultation) => ({
        ...consultation,
        // Example: Parse stringified data back to objects
        // supporting_documents: JSON.parse(consultation.supporting_documents),
      }));

      return {
        success: true,
        message: 'Based consultations retrieved successfully',
        data: processedConsultations,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve based consultations',
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching based consultations',
      };
    }
  }

  // Find based consultation by id
  async findOne(id: number): Promise<ApiResponse<BasedConsultation>> {
    try {
      const consultation = await this.basedConsultationRepository.findOne({
        where: { id } // Adjust field name if your primary key is different
      });

      if (!consultation) {
        throw new NotFoundException(`Based consultation with id ${id} not found`);
      }

      // Process any stringified data if needed
      const processedConsultation = {
        ...consultation,
        // Example: Parse stringified data back to objects
        // supporting_documents: JSON.parse(consultation.supporting_documents),
      };

      return {
        success: true,
        message: 'Based consultation found successfully',
        data: processedConsultation,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to find based consultation with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while finding based consultation',
      };
    }
  }

  // Update based consultation by id
  async update(
    id: number,
    updateBasedConsultationDto: UpdateBasedConsultationDto,
  ): Promise<ApiResponse<BasedConsultation>> {
    try {
      // Confirm if consultation exists
      const consultation = await this.basedConsultationRepository.findOne({
        where: { id } // Adjust field name if your primary key is different
      });

      if (!consultation) {
        throw new NotFoundException(`Based consultation with id ${id} not found`);
      }

      // Prepare the update data
      const preparedUpdate: Partial<BasedConsultation> = {
        ...updateBasedConsultationDto,
      } as Partial<BasedConsultation>;

      // Add any necessary transformations for specific fields
      // Example: Convert dates, stringify arrays/objects, etc.
      // if (updateBasedConsultationDto.consultation_date) {
      //   preparedUpdate.consultation_date = new Date(updateBasedConsultationDto.consultation_date);
      // }
      // if (updateBasedConsultationDto.supporting_documents) {
      //   preparedUpdate.supporting_documents = JSON.stringify(updateBasedConsultationDto.supporting_documents);
      // }

      const updatedConsultation = await this.basedConsultationRepository.save({
        ...consultation,
        ...preparedUpdate,
      });

      return {
        success: true,
        message: 'Based consultation updated successfully',
        data: updatedConsultation,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update based consultation with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating based consultation',
      };
    }
  }

  // Remove based consultation by id
  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const consultation = await this.basedConsultationRepository.findOne({
        where: { id } // Adjust field name if your primary key is different
      });

      if (!consultation) {
        throw new NotFoundException(`Based consultation with id ${id} not found`);
      }

      await this.basedConsultationRepository.remove(consultation);

      return {
        success: true,
        message: 'Based consultation deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to delete based consultation with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while deleting based consultation',
      };
    }
  }

  // Optional: Add status update method if your entity has a status field
  async updateStatus(
    id: number,
    status: string, // or use an enum if you have specific status values
  ): Promise<ApiResponse<BasedConsultation>> {
    try {
      const consultation = await this.basedConsultationRepository.findOne({
        where: { id }
      });

      if (!consultation) {
        throw new NotFoundException(`Based consultation with id ${id} not found`);
      }

      const updatedConsultation = await this.basedConsultationRepository.save({
        ...consultation,
        status,
      });

      return {
        success: true,
        message: 'Based consultation status updated successfully',
        data: updatedConsultation,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update based consultation status with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating status',
      };
    }
  }
}