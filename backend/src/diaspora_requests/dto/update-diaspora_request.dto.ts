import { PartialType } from '@nestjs/swagger';
import { CreateDiasporaRequestDto } from './create-diaspora_request.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateDiasporaRequestDto extends PartialType(CreateDiasporaRequestDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  id?: number;
}
