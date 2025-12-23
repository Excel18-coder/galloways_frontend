import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { AtGuard } from '../auth/token/token.guard';
import { Role } from '../users/entities/user.entity';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@Controller('resources')
@ApiBearerAuth()
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

  // ==================== ADMIN-ONLY TEMPLATE ENDPOINTS ====================

  @Get('templates/list')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async listTemplates() {
    try {
      const templates = await this.resourcesService.getAvailableTemplates();
      return {
        success: true,
        data: templates,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch templates',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get('templates/:templateName')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getTemplate(
    @Param('templateName') templateName: string,
    @Res() res: Response,
  ) {
    try {
      const templateContent =
        await this.resourcesService.getTemplate(templateName);

      res.setHeader('Content-Type', 'text/html');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${templateName}"`,
      );
      res.send(templateContent);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Template not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  @Get('templates/:templateName/download')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async downloadTemplate(
    @Param('templateName') templateName: string,
    @Res() res: Response,
  ) {
    try {
      const templateContent =
        await this.resourcesService.getTemplate(templateName);

      // Determine content type based on file extension
      const contentType = templateName.endsWith('.pdf') 
        ? 'application/pdf' 
        : 'text/html';
      
      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${templateName}"`,
      );
      
      // Send buffer directly for PDFs, string for HTML
      res.send(templateContent);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Template not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  @Put('templates/:templateName')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateTemplate(
    @Param('templateName') templateName: string,
    @Body('content') content: string,
  ) {
    try {
      await this.resourcesService.updateTemplate(templateName, content);
      return {
        success: true,
        message: 'Template updated successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update template',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
