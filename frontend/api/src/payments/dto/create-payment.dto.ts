import { IsNumber, IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { paymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  paymentProvider?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  status?: paymentStatus;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  consultationId?: number;

  @IsNumber()
  @IsOptional()
  diasporaRequestId?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
