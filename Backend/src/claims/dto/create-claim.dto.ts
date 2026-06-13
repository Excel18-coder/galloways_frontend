import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ClaimType, Document } from '../entities/claim.entity';
export class CreateClaimDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  policy_number: number;

  @IsEnum(ClaimType)
  @IsNotEmpty()
  claim_type: ClaimType;

  @IsDateString()
  @IsNotEmpty()
  incident_date: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
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
