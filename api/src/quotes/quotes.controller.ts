import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        location: { type: 'string' },
        product: { type: 'string' },
        budget: { type: 'string' },
        coverage: { type: 'string' },
        details: { type: 'string' },
        contactMethod: { type: 'string' },
        bestTime: { type: 'string' },
        terms: { type: 'boolean' },
        selectedProduct: { type: 'string' },
        status: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        documents: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['firstName', 'email', 'terms'],
    },
  })
  async create(
    @Body() createQuoteDto: CreateQuoteDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ApiResponse<Quote>> {
    let uploadedDocuments: {
      original_name: string;
      size: number | undefined;
      created_at: string;
      path: string;
      mime_type: string | undefined;
      public_id: string;
    }[] = [];

    if (files && files.length > 0) {
      try {
        const uploadResults = await this.cloudinaryService.uploadFiles(files);
        uploadedDocuments = uploadResults.map((result) => ({
          original_name: result?.original_name ?? "Uploaded_file",
          size: result.size,
          created_at: new Date().toISOString(),
          path: result.path,
          mime_type: result.mime_type,
          public_id: result.public_id,
        }));
      } catch (error) {
        console.error('File upload error:', error);
        throw new HttpException(
          'Failed to upload files',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const quoteData = {
      ...createQuoteDto,
      documents: uploadedDocuments, // Add uploaded documents to DTO
    };

    return this.quotesService.create(quoteData);
  }
  @Get()
  findAll(): Promise<ApiResponse<(Omit<Quote, "documents"> & { documents: any[]; })[]>> {
    return this.quotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Quote>> {
    return this.quotesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ): Promise<ApiResponse<Quote>> {
    return this.quotesService.update(id, updateQuoteDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ): Promise<ApiResponse<Quote>> {
    return this.quotesService.updateStatus(id, body.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<void>> {
    return this.quotesService.remove(id);
  }
}
