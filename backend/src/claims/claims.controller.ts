import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Param,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { Claim, claimStatus } from './entities/claim.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';

// import { RolesGuard } from 'src/auth/guards';
// import { AtGuard } from 'src/auth/token/token.guard';

// Define ApiResponse interface to match the service
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
@Controller('claims')
@ApiBearerAuth()
export class ClaimsController {
  constructor(
    private readonly claimsService: ClaimsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('supporting_documents'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        policy_number: { type: 'string' },
        claim_type: { type: 'string' },
        incident_date: { type: 'string', format: 'date' },
        estimated_loss: { type: 'number' },
        description: { type: 'string' },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        supporting_documents: {
          oneOf: [
            {
              type: 'string',
              format: 'binary',
            },
            {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          ],
        },
      },
    },
  })
  async create(
    @Body() createClaimDto: CreateClaimDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|doc|docx)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<any> {
    let uploadedDocuments: {
      original_name: string;
      size: number | undefined;
      created_at: string;
      path: string;
      mime_type: string | undefined;
      public_id: string;
    }[] = [];

    // Upload files to Cloudinary if any
    if (files && files.length > 0) {
      try {
        const uploadResults = await this.cloudinaryService.uploadFiles(files);
        uploadedDocuments = uploadResults.map((result) => ({
          original_name: result.original_name,
          size: result.bytes,
          created_at: new Date().toISOString(),
          path: result.path,
          mime_type: result.format,
          public_id: result.public_id,
        }));
      } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload files');
      }
    }

    // Add uploaded documents to the DTO
    const claimData = {
      ...createClaimDto,
      supporting_documents: uploadedDocuments,
    };

    return this.claimsService.createClaim(claimData);
  }

  // get all claims
  @Get()
  findAll(): Promise<ApiResponse<Claim[]>> {
    return this.claimsService.findAll();
  }
  // get claim by id
  @Get(':id')
  getClaimById(@Param('id') id: number): Promise<ApiResponse<Claim>> {
    return this.claimsService.getClaimById(id);
  }
  // update claim by id
  @Put(':id')
  async updateClaim(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClaimDto: UpdateClaimDto,
  ): Promise<ApiResponse<Claim>> {
    return this.claimsService.updateClaim(id, updateClaimDto);
  }
  // update claim status by id
  @Put(':id/status')
  async updateClaimStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClaimDto: { status: claimStatus },
  ): Promise<ApiResponse<Claim>> {
    return this.claimsService.updateClaimStatus(id, updateClaimDto);
  }

  // delete claim by id
  @Delete(':id')
  async deleteClaim(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse> {
    return this.claimsService.deleteClaim(id);
  }
}
