import { IsString, IsNumber, IsOptional } from 'class-validator';

export class InitiateSTKPushDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  amount: number;

  @IsString()
  accountReference: string;

  @IsString()
  transactionDesc: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  consultationId?: number;
}