import { PartialType } from '@nestjs/swagger';
import { CreateBasedConsultationDto } from './create-based-consultation.dto';

export class UpdateBasedConsultationDto extends PartialType(CreateBasedConsultationDto) {}
