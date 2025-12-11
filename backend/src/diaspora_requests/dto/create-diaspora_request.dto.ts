import { IsNumber, IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateDiasporaRequestDto {
  // @IsNumber()
  // @IsNotEmpty()
  // user_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsString()
  @IsNotEmpty()
  consult_time: string;

  @IsNotEmpty()
  amount: number;

  // @IsString()
  // @IsOptional()
  // status?: string;
}
