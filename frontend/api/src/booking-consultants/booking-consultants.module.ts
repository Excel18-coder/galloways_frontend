import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingConsultantsService } from './booking-consultants.service';
import { BookingConsultantsController } from './booking-consultants.controller';
import { BookingConsultant } from './entities/booking-consultant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingConsultant])],
  controllers: [BookingConsultantsController],
  providers: [BookingConsultantsService],
})
export class BookingConsultantsModule { }
