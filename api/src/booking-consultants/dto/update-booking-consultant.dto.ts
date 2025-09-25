import { PartialType } from '@nestjs/swagger';
import { CreateBookingConsultantDto } from './create-booking-consultant.dto';

export class UpdateBookingConsultantDto extends PartialType(CreateBookingConsultantDto) {}
