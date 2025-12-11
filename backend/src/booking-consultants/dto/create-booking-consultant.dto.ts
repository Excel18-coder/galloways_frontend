import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ConsultationType } from '../entities/booking-consultant.entity';

export class CreateBookingConsultantDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    organization: string;

    @IsEnum(ConsultationType)
    @IsNotEmpty()
    consult_type: ConsultationType;

    @IsDateString()
    @IsNotEmpty()
    preferred_date: string;

    @IsString()
    @IsNotEmpty()
    preferred_time: string;

    @IsString()
    @IsOptional()
    details?: string;
}
