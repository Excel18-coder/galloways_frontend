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
import * as http from 'http';
import * as https from 'https';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guards';
import { AtGuard } from '../auth/token/token.guard';
import { Role } from '../users/entities/user.entity';
import { ResourcesService } from './resources.service';

@ApiTags('Resources')
@Controller('resources')
@ApiBearerAuth()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  private isUpstreamAuthFailure(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes('(401)') || message.includes('(403)');
  }

  private proxyFileToResponse(
    url: string,
    res: Response,
    redirectsLeft = 5,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const client = url.startsWith('https://') ? https : http;
        const req = client.get(url, (fileRes) => {
          const statusCode = fileRes.statusCode || 0;

          if (
            [301, 302, 303, 307, 308].includes(statusCode) &&
            fileRes.headers.location &&
            redirectsLeft > 0
          ) {
            const nextUrl = new URL(fileRes.headers.location, url).toString();
            fileRes.resume();
            this.proxyFileToResponse(nextUrl, res, redirectsLeft - 1)
              .then(resolve)
              .catch(reject);
            return;
          }

          if (statusCode >= 400) {
            fileRes.resume();
            reject(new Error(`Upstream file request failed (${statusCode})`));
            return;
          }

          const upstreamContentLength = fileRes.headers['content-length'];
          if (upstreamContentLength && !res.getHeader('Content-Length')) {
            res.setHeader('Content-Length', upstreamContentLength);
          }

          fileRes.on('error', reject);
          res.on('close', () => {
            try {
              fileRes.destroy();
            } catch {
              // ignore
            }
          });

          fileRes.pipe(res);
          fileRes.on('end', () => resolve());
        });

        req.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

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
  async downloadResource(@Param('id') id: string, @Res() res: Response) {
    try {
      const resource = await this.resourcesService.getResourceById(id);
      await this.resourcesService.incrementDownloads(id);

      const isPdf = (resource.fileType || '').toLowerCase().includes('pdf');
      const safeName =
        resource.originalName || resource.filename || `resource-${id}`;
      const filename =
        isPdf && !safeName.toLowerCase().endsWith('.pdf')
          ? `${safeName}.pdf`
          : safeName;

      res.setHeader(
        'Content-Type',
        resource.fileType || 'application/octet-stream',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      try {
        await this.proxyFileToResponse(resource.url, res);
      } catch (error) {
        if (this.isUpstreamAuthFailure(error) && resource.publicId) {
          const signedUrl =
            this.resourcesService.getCloudinaryDownloadUrl(resource);
          if (signedUrl) {
            await this.proxyFileToResponse(signedUrl, res);
            return;
          }
        }
        throw error;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: message || 'Failed to download resource',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
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
      const templates = await this.resourcesService.listTemplates();
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

      const contentType = templateName.endsWith('.pdf')
        ? 'application/pdf'
        : 'text/html';

      res.setHeader('Content-Type', contentType);
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
      // Convert HTML template to PDF
      const pdfBuffer =
        await this.resourcesService.convertTemplateToPdf(templateName);

      // Generate PDF filename
      const pdfFilename = templateName.replace('.html', '.pdf');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${pdfFilename}"`,
      );
      res.setHeader('Content-Length', pdfBuffer.length.toString());

      res.send(pdfBuffer);
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
