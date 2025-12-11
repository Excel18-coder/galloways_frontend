import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ConsultType } from '../entities/consultation.entity';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(ConsultType)
  @IsNotEmpty()
  consult_type: ConsultType;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
