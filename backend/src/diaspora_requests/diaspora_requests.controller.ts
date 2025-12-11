import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { DiasporaRequestsService } from './diaspora_requests.service';
import { CreateDiasporaRequestDto } from './dto/create-diaspora_request.dto';
import { UpdateDiasporaRequestDto } from './dto/update-diaspora_request.dto';
import { DiasporaRequest } from './entities/diaspora_request.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('diaspora-requests')
export class DiasporaRequestsController {
  constructor(private readonly diasporaRequestsService: DiasporaRequestsService) {}

  @Post()
  create(@Body() createDiasporaRequestDto: CreateDiasporaRequestDto): Promise<ApiResponse<DiasporaRequest>> {
    return this.diasporaRequestsService.create(createDiasporaRequestDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<DiasporaRequest[]>> {
    return this.diasporaRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<DiasporaRequest>> {
    return this.diasporaRequestsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiasporaRequestDto: UpdateDiasporaRequestDto,
  ): Promise<ApiResponse<DiasporaRequest>> {
    return this.diasporaRequestsService.update(id, updateDiasporaRequestDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatus: { status: string },
  ): Promise<ApiResponse<DiasporaRequest>> {
    return this.diasporaRequestsService.updateStatus(id, updateStatus.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.diasporaRequestsService.remove(id);
  }
}
