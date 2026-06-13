import { IsNumber, IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform(({ value, obj }) => value || obj.paymentMethod)
  method: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  status?: paymentStatus;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  paymentProvider?: string;

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

  @IsOptional()
  diasporaRequestId?: number;
}
