import { IsNumber, IsNotEmpty, IsString, IsEmail, IsOptional, IsObject, IsEnum } from 'class-validator';

import { NatureOfOutsourcing } from '../entities/outsourcing_request.entity';
import { BudgetRange } from '../entities/outsourcing_request.entity';
import { OutsourcingService } from '../entities/outsourcing_request.entity';
export class CreateOutsourcingRequestDto {
  // @IsNumber()
  // @IsNotEmpty()
  // user_id: number;

  @IsString()
  @IsNotEmpty()
  organization_name: string;

  @IsString()
  @IsNotEmpty()
  core_functions: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsEnum(OutsourcingService)
  @IsOptional()
  services: string[];

  @IsEnum(NatureOfOutsourcing)
  @IsNotEmpty()
  nature_of_outsourcing:NatureOfOutsourcing ; 

  @IsEnum(BudgetRange)
  @IsNotEmpty()
  budget_range: BudgetRange;

  
}
