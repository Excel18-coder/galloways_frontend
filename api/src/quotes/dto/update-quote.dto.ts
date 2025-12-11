import { PartialType } from '@nestjs/swagger';
import { CreateQuoteDto } from './create-quote.dto';
import { IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
// import { quoteStatus } from '../entities/quote.entity';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  id?: number;

  // @IsOptional()
  // @IsEnum(quoteStatus)
  // status?: quoteStatus;
}
