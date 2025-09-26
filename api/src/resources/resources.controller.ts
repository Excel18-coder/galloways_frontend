import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  NotFoundException,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import * as fs from 'fs';

// Configure multer for file uploads
const storage = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = join(process.cwd(), 'uploads', 'resources');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { 
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    }
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
    @Body('category') category?: string
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const createResourceDto: CreateResourceDto = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        description: description || undefined,
        category: category || 'general',
        isActive: true
      };

      const resource = await this.resourcesService.create(createResourceDto);
      
      return {
        success: true,
        message: 'File uploaded successfully',
        data: resource
      };
    } catch (error) {
      // Clean up file if database save fails
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query('category') category?: string) {
    try {
      let resources;
      
      if (category) {
        resources = await this.resourcesService.findByCategory(category);
      } else {
        resources = await this.resourcesService.findAll();
      }

      return {
        success: true,
        message: 'Resources retrieved successfully',
        data: resources
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('stats')
  async getStats() {
    try {
      const stats = await this.resourcesService.getStats();
      
      return {
        success: true,
        message: 'Resource statistics retrieved successfully',
        data: stats
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const resource = await this.resourcesService.findOne(+id);
      
      return {
        success: true,
        message: 'Resource retrieved successfully',
        data: resource
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const { stream, resource } = await this.resourcesService.getFileStream(+id);
      
      res.set({
        'Content-Type': resource.mimeType,
        'Content-Disposition': `attachment; filename="${resource.originalName}"`,
        'Content-Length': resource.size.toString(),
      });

      stream.pipe(res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to download file'
        });
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    try {
      const resource = await this.resourcesService.update(+id, updateResourceDto);
      
      return {
        success: true,
        message: 'Resource updated successfully',
        data: resource
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.resourcesService.remove(+id);
      
      return {
        success: true,
        message: 'Resource deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/permanent')
  async permanentDelete(@Param('id') id: string) {
    try {
      await this.resourcesService.hardDelete(+id);
      
      return {
        success: true,
        message: 'Resource permanently deleted'
      };
    } catch (error) {
      throw error;
    }
  }
}