import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

export interface UploadedDocument {
  original_name: string;
  size: number;
  path: string;
  mime_type: string;
  public_id: string;
  bytes?: number;
  asset_id?: string;
  format?: string;
  resource_type?: string;
  filename?: string;
  url?: string;
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  private inferFormat(fileNameOrUrl?: string, mimeType?: string): string {
    const fromName = (fileNameOrUrl ?? '').split('?')[0].split('#')[0];
    const lastDot = fromName.lastIndexOf('.');
    if (lastDot >= 0 && lastDot < fromName.length - 1) {
      const ext = fromName.slice(lastDot + 1).toLowerCase();
      if (/^[a-z0-9]{1,10}$/.test(ext)) return ext;
    }

    const lowerMime = (mimeType ?? '').toLowerCase();
    if (lowerMime.includes('pdf')) return 'pdf';
    if (lowerMime.startsWith('image/')) return lowerMime.split('/')[1] || 'jpg';
    if (lowerMime.startsWith('video/')) return lowerMime.split('/')[1] || 'mp4';
    return 'bin';
  }

  private inferResourceType(mimeType?: string): 'image' | 'video' | 'raw' {
    const lowerMime = (mimeType ?? '').toLowerCase();
    if (lowerMime.includes('pdf')) return 'image';
    if (lowerMime.startsWith('image/')) return 'image';
    if (lowerMime.startsWith('video/')) return 'video';
    return 'raw';
  }

  private inferDeliveryTypeFromUrl(
    url?: string,
  ): 'upload' | 'private' | 'authenticated' {
    const lowerUrl = (url ?? '').toLowerCase();
    if (lowerUrl.includes('/authenticated/')) return 'authenticated';
    if (lowerUrl.includes('/private/')) return 'private';
    return 'upload';
  }

  getPrivateDownloadUrl(options: {
    publicId: string;
    originalName?: string;
    url?: string;
    mimeType?: string;
    expiresInSeconds?: number;
  }): string {
    const format = this.inferFormat(
      options.originalName || options.url,
      options.mimeType,
    );
    const resourceType = this.inferResourceType(options.mimeType);
    const type = this.inferDeliveryTypeFromUrl(options.url);

    const expiresAt =
      Math.floor(Date.now() / 1000) + (options.expiresInSeconds ?? 60 * 60);

    return cloudinary.utils.private_download_url(options.publicId, format, {
      resource_type: resourceType,
      type,
      expires_at: expiresAt,
      attachment: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadedDocument> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'claims',
          access_mode: 'public',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(
              new Error(
                error instanceof Error ? error.message : JSON.stringify(error),
              ),
            );
          } else if (result) {
            resolve({
              original_name: result?.original_filename ?? 'Uploaded_file',
              size: result.bytes,
              path: result.secure_url,
              mime_type: result.format,
              public_id: result.public_id,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
              filename: result.original_filename || file.originalname,
              url: result.secure_url,
            });
          } else {
            reject(new Error('Cloudinary upload returned undefined result.'));
          }
        },
      );

      // Convert buffer to stream
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream);
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<UploadedDocument[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    return cloudinary.uploader.destroy(publicId) as Promise<{ result: string }>;
  }
}
