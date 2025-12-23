import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsObject,
  IsBoolean,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateQuoteDto {
  // Personal Information
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  // Product Information
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  selectedProduct: string;

  @IsString()
  @IsOptional()
  constructionType?: string;

  @IsString()
  @IsOptional()
  occupancy?: string;

  // Quote Details
  @IsString()
  @IsNotEmpty()
  budget: string;

  @IsString()
  @IsNotEmpty()
  coverage: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsString()
  @IsNotEmpty()
  contactMethod: string;

  @IsString()
  @IsNotEmpty()
  bestTime: string;

  @IsOptional()
  documents?: any;

  @IsBoolean()
  @IsNotEmpty()
  terms: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}
