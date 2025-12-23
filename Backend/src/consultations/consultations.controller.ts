import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { Consultation, ConsultationStatus } from './entities/consultation.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) { }

  @Post()
  create(@Body() createConsultationDto: CreateConsultationDto): Promise<ApiResponse<Consultation>> {
    console.log('📋 POST /consultations endpoint called with data:', createConsultationDto);
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<Consultation[]>> {
    console.log('📋 GET /consultations endpoint called');
    return this.consultationsService.findAll();
  }

  @Get('test')
  async testConnection(): Promise<ApiResponse<{ message: string; count: number }>> {
    console.log('📋 GET /consultations/test endpoint called');
    return this.consultationsService.testConnection();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Consultation>> {
    return this.consultationsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ): Promise<ApiResponse<Consultation>> {
    return this.consultationsService.update(id, updateConsultationDto);
  }
  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedStatus: { status: ConsultationStatus },
  ): Promise<ApiResponse<Consultation>> {
    return this.consultationsService.updateStatus(id, updatedStatus.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.consultationsService.remove(id);
  }
}
