import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { OutsourcingRequestsService } from './outsourcing_requests.service';
import { CreateOutsourcingRequestDto } from './dto/create-outsourcing_request.dto';
import { UpdateOutsourcingRequestDto } from './dto/update-outsourcing_request.dto';
import { OutsourcingRequest } from './entities/outsourcing_request.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('outsourcing-requests')
export class OutsourcingRequestsController {
  constructor(private readonly outsourcingRequestsService: OutsourcingRequestsService) { }

  @Post()
  create(@Body() createOutsourcingRequestDto: CreateOutsourcingRequestDto): Promise<ApiResponse<OutsourcingRequest>> {
    return this.outsourcingRequestsService.create(createOutsourcingRequestDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<OutsourcingRequest[]>> {
    return this.outsourcingRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<OutsourcingRequest>> {
    return this.outsourcingRequestsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOutsourcingRequestDto: UpdateOutsourcingRequestDto,
  ): Promise<ApiResponse<OutsourcingRequest>> {
    return this.outsourcingRequestsService.update(id, updateOutsourcingRequestDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatus: { status: string },
  ): Promise<ApiResponse<OutsourcingRequest>> {
    return this.outsourcingRequestsService.updateStatus(id, updateStatus.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.outsourcingRequestsService.remove(id);
  }
}
