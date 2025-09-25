import { PartialType } from '@nestjs/swagger';
import { CreateOutsourcingRequestDto } from './create-outsourcing_request.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateOutsourcingRequestDto extends PartialType(CreateOutsourcingRequestDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  id?: number;
}
