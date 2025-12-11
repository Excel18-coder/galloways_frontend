import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ClaimType, Document } from '../entities/claim.entity';
export class CreateClaimDto {
  @IsNumber()
  @IsNotEmpty()
  policy_number: number;

  @IsEnum(ClaimType)
  @IsNotEmpty()
  claim_type: ClaimType;

  @IsDateString()
  @IsNotEmpty()
  incident_date: string;

  @IsNumber()
  @IsNotEmpty()
  estimated_loss: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  supporting_documents: any;
}
