import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BookingConsultantsService } from './booking-consultants.service';
import { CreateBookingConsultantDto } from './dto/create-booking-consultant.dto';
import { UpdateBookingConsultantDto } from './dto/update-booking-consultant.dto';
import { BookingConsultant } from './entities/booking-consultant.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('booking-consultants')
export class BookingConsultantsController {
  constructor(private readonly bookingConsultantsService: BookingConsultantsService) { }

  @Post()
  create(
    @Body() createBookingConsultantDto: CreateBookingConsultantDto,
  ): Promise<ApiResponse<BookingConsultant>> {
    return this.bookingConsultantsService.create(createBookingConsultantDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<BookingConsultant[]>> {
    return this.bookingConsultantsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<BookingConsultant>> {
    return this.bookingConsultantsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingConsultantDto: UpdateBookingConsultantDto,
  ): Promise<ApiResponse<BookingConsultant>> {
    return this.bookingConsultantsService.update(id, updateBookingConsultantDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.bookingConsultantsService.remove(id);
  }
}
