import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim, claimStatus } from './entities/claim.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Define ApiResponse interface to match the controller
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) { }
  // create claim
  async createClaim(
    createClaimDto: CreateClaimDto,
  ): Promise<ApiResponse<Claim>> {
    try {
      const preparedClaim: Partial<Claim> = {
        ...createClaimDto,
        supporting_documents: JSON.stringify(
          createClaimDto.supporting_documents,
        ),
        incident_date: new Date(
          createClaimDto.incident_date as unknown as string,
        ),
        phone: String(createClaimDto.phone),
      } as Partial<Claim>;

      const newClaim = this.claimRepository.create(preparedClaim);
      const savedClaim = await this.claimRepository.save(newClaim);
      return {
        success: true,
        message: 'Claim created successfully',
        data: savedClaim,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create claim',
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating claim',
      };
    }
  }

  // find all claims
  async findAll(): Promise<ApiResponse<Claim[]>> {
    try {
      const claims = await this.claimRepository.find({
        order: { created_at: 'DESC' },
      });

      return {
        success: true,
        message: 'Claims retrieved successfully',
        data: claims.map((claim) => ({ ...claim, supporting_documents: JSON.parse(claim.supporting_documents) })),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve claims',
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while fetching claim',
      };
    }
  }

  // find claim by id
  async getClaimById(id: number): Promise<ApiResponse<Claim>> {
    try {
      const claim = await this.claimRepository.findOne({ where: { Id: id } });
      console.log('Found claim:', claim);
      if (!claim) {
        throw new NotFoundException(`Claim with id ${id} not found`);
      }
      return {
        success: true,
        message: 'Claim found successfully',
        data: { ...claim, supporting_documents: JSON.parse(claim.supporting_documents) }
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to find claim with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating claim',
      };
    }
  }

  // update claim by id
  async updateClaim(
    id: number,
    updateClaimDto: UpdateClaimDto,
  ): Promise<ApiResponse<Claim>> {
    try {
      // confirm if claim exists
      const claim = await this.claimRepository.findOne({ where: { Id: id } });
      if (!claim) {
        throw new NotFoundException(`Claim with id ${id} not found`);
      }
      const preparedUpdate: Partial<Claim> = {
        ...updateClaimDto,
      } as Partial<Claim>;

      if (updateClaimDto.incident_date) {
        preparedUpdate.incident_date = new Date(
          updateClaimDto.incident_date as unknown as string,
        );
      }
      if (updateClaimDto.phone !== undefined) {
        preparedUpdate.phone = String(updateClaimDto.phone);
      }

      const updatedClaim = await this.claimRepository.save({
        ...claim,
        ...preparedUpdate,
      });
      return {
        success: true,
        message: 'Claim updated successfully',
        data: updatedClaim,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update claim with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating claim',
      };
    }
  }

  async updateClaimStatus(
    id: number,
    updateClaimDto: { status: claimStatus },
  ): Promise<ApiResponse<Claim>> {
    try {
      // confirm if claim exists
      const claim = await this.claimRepository.findOne({ where: { Id: id } });
      if (!claim) {
        throw new NotFoundException(`Claim with id ${id} not found`);
      }
      const updatedClaim = await this.claimRepository.save({
        ...claim,
        status: updateClaimDto.status,
      });
      return {
        success: true,
        message: 'Claim status updated successfully',
        data: updatedClaim,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update claim status with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating claim',
      };
    }
  }
  // delete claim by id
  async deleteClaim(id: number): Promise<ApiResponse<null>> {
    try {
      const claim = await this.claimRepository.findOne({ where: { Id: id } });
      if (!claim) {
        throw new NotFoundException(`Claim with id ${id} not found`);
      }
      await this.claimRepository.remove(claim);
      return {
        success: true,
        message: 'Claim deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to delete claim with id ${id}`,
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred while creating claim',
      };
    }
  }
}
