import { PartialType } from '@nestjs/swagger';
import { CreateClaimDto } from './create-claim.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateClaimDto extends PartialType(CreateClaimDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  Id?: number;
}
