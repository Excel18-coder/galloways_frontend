import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { BasedConsultationService } from './based-consultation.service';
import { CreateBasedConsultationDto } from './dto/create-based-consultation.dto';
import { UpdateBasedConsultationDto } from './dto/update-based-consultation.dto';

@Controller('based-consultation')
export class BasedConsultationController {
  constructor(private readonly basedConsultationService: BasedConsultationService) { }

  @Post()
  async create(@Body() createBasedConsultationDto: CreateBasedConsultationDto) {
    const result = await this.basedConsultationService.create(createBasedConsultationDto);

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }

  @Get()
  async findAll() {
    const result = await this.basedConsultationService.findAll();

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.basedConsultationService.findOne(+id);

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBasedConsultationDto: UpdateBasedConsultationDto
  ) {
    const result = await this.basedConsultationService.update(+id, updateBasedConsultationDto);

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.basedConsultationService.remove(+id);

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }

  // Optional: Add status update endpoint if you have the status update method
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string }
  ) {
    const result = await this.basedConsultationService.updateStatus(+id, body.status);

    if (!result.success) {
      throw new HttpException(
        {
          message: result.message,
          error: result.error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: result.message,
      data: result.data,
    };
  }
}