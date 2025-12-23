import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourcesService } from './resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadResource(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category: string,
    @Body('description') description?: string,
  ) {
    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    try {
      const resource = await this.resourcesService.uploadResource(
        file,
        category,
        description,
      );

      return {
        success: true,
        message: 'Resource uploaded successfully',
        data: resource,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload resource',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get()
  async getAllResources(@Query('category') category?: string) {
    try {
      const resources = await this.resourcesService.getAllResources(category);
      return {
        success: true,
        data: resources,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch resources',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.resourcesService.getStats();
      return {
        success: true,
        data: stats,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch stats',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get(':id')
  async getResourceById(@Param('id') id: string) {
    try {
      const resource = await this.resourcesService.getResourceById(id);
      return {
        success: true,
        data: resource,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Resource not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }

  @Get(':id/download')
  async downloadResource(@Param('id') id: string) {
    try {
      const resource = await this.resourcesService.getResourceById(id);
      await this.resourcesService.incrementDownloads(id);

      return {
        success: true,
        data: resource,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to download resource',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    try {
      await this.resourcesService.deleteResource(id);
      return {
        success: true,
        message: 'Resource deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete resource',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
