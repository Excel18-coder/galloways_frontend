import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingConsultantDto } from './dto/create-booking-consultant.dto';
import { UpdateBookingConsultantDto } from './dto/update-booking-consultant.dto';
import { BookingConsultant } from './entities/booking-consultant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class BookingConsultantsService {
  constructor(
    @InjectRepository(BookingConsultant)
    private readonly bookingRepository: Repository<BookingConsultant>,
  ) { }

  async create(
    createBookingConsultantDto: CreateBookingConsultantDto,
  ): Promise<ApiResponse<BookingConsultant>> {
    try {
      const preparedBooking: Partial<BookingConsultant> = {
        ...createBookingConsultantDto,
        preferred_date: createBookingConsultantDto.preferred_date,
        preferred_time: createBookingConsultantDto.preferred_time,
      };

      const newBooking = this.bookingRepository.create(preparedBooking);
      const savedBooking = await this.bookingRepository.save(newBooking);
      return {
        success: true,
        message: 'Booking consultation created successfully',
        data: savedBooking,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create booking consultation',
        error: error.message,
      };
    }
  }

  async findAll(): Promise<ApiResponse<BookingConsultant[]>> {
    try {
      const bookings = await this.bookingRepository.find({
        order: { created_at: 'DESC' },
      });
      return {
        success: true,
        message: 'Booking consultations retrieved successfully',
        data: bookings,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve booking consultations',
        error: error.message,
      };
    }
  }

  async findOne(id: number): Promise<ApiResponse<BookingConsultant>> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking consultation with id ${id} not found`);
      }
      return {
        success: true,
        message: 'Booking consultation found',
        data: booking,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: 'Failed to retrieve booking consultation',
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    updateBookingConsultantDto: UpdateBookingConsultantDto,
  ): Promise<ApiResponse<BookingConsultant>> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking consultation with id ${id} not found`);
      }

      const { preferred_date, preferred_time, ...rest } = updateBookingConsultantDto as {
        preferred_date?: string;
        preferred_time?: string;
        [key: string]: any;
      };
      const prepared: Partial<BookingConsultant> = { ...(rest as Partial<BookingConsultant>) };
      if (preferred_date) {
        prepared.preferred_date = preferred_date;
      }
      if (preferred_time) {
        prepared.preferred_time = preferred_time;
      }

      const updatedBooking = await this.bookingRepository.save({
        ...booking,
        ...prepared,
      });

      return {
        success: true,
        message: 'Booking consultation updated successfully',
        data: updatedBooking,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: 'Failed to update booking consultation',
        error: error.message,
      };
    }
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    try {
      const booking = await this.bookingRepository.findOne({ where: { id } });
      if (!booking) {
        throw new NotFoundException(`Booking consultation with id ${id} not found`);
      }

      await this.bookingRepository.remove(booking);
      return {
        success: true,
        message: 'Booking consultation deleted successfully',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: 'Failed to delete booking consultation',
        error: error.message,
      };
    }
  }
}
