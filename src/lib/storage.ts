// S3 Storage Service for image management
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import crypto from 'crypto';

export interface StorageConfig {
  bucketName: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface ImageVariants {
  original: string;
  optimized: string;
  thumbnail: string;
}

export class StorageService {
  private s3Client: S3Client;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  /**
   * Upload image with variants (original, optimized, thumbnail)
   */
  async uploadImage(
    key: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<ImageVariants> {
    const variants: ImageVariants = {
      original: '',
      optimized: '',
      thumbnail: '',
    };

    // Upload original
    variants.original = await this.uploadFile(
      `originals/${key}`,
      buffer,
      contentType,
      metadata
    );

    // Generate and upload optimized version
    const optimizedBuffer = await this.optimizeImage(buffer, contentType);
    variants.optimized = await this.uploadFile(
      `optimized/${key}`,
      optimizedBuffer,
      'image/webp',
      { ...metadata, variant: 'optimized' }
    );

    // Generate and upload thumbnail
    const thumbnailBuffer = await this.generateThumbnail(buffer);
    variants.thumbnail = await this.uploadFile(
      `thumbs/${key}`,
      thumbnailBuffer,
      'image/webp',
      { ...metadata, variant: 'thumbnail' }
    );

    return variants;
  }

  /**
   * Upload a single file to S3
   */
  private async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    await this.s3Client.send(command);
    return key;
  }

  /**
   * Generate optimized version of image
   */
  private async optimizeImage(buffer: Buffer, contentType: string): Promise<Buffer> {
    const sharpInstance = sharp(buffer);

    // Resize if too large (max 2048px on longest side)
    const metadata = await sharpInstance.metadata();
    if (metadata.width && metadata.height) {
      const maxDimension = Math.max(metadata.width, metadata.height);
      if (maxDimension > 2048) {
        const scale = 2048 / maxDimension;
        sharpInstance.resize(
          Math.round(metadata.width * scale),
          Math.round(metadata.height * scale),
          { fit: 'inside', withoutEnlargement: true }
        );
      }
    }

    // Convert to WebP with quality optimization
    return await sharpInstance
      .webp({ quality: 85, effort: 6 })
      .toBuffer();
  }

  /**
   * Generate thumbnail (300x300 max)
   */
  private async generateThumbnail(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize(300, 300, { fit: 'cover', position: 'center' })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
  }

  /**
   * Get signed URL for image access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Get signed URLs for all image variants
   */
  async getImageUrls(baseKey: string): Promise<{
    original?: string;
    optimized?: string;
    thumbnail?: string;
  }> {
    const urls: any = {};

    try {
      urls.original = await this.getSignedUrl(`originals/${baseKey}`);
    } catch (error) {
      // Original might not exist
    }

    try {
      urls.optimized = await this.getSignedUrl(`optimized/${baseKey}`);
    } catch (error) {
      // Optimized might not exist
    }

    try {
      urls.thumbnail = await this.getSignedUrl(`thumbs/${baseKey}`);
    } catch (error) {
      // Thumbnail might not exist
    }

    return urls;
  }

  /**
   * Delete image and all its variants
   */
  async deleteImage(baseKey: string): Promise<void> {
    const variants = [
      `originals/${baseKey}`,
      `optimized/${baseKey}`,
      `thumbs/${baseKey}`,
    ];

    await Promise.all(
      variants.map(key =>
        this.s3Client.send(
          new DeleteObjectCommand({
            Bucket: this.config.bucketName,
            Key: key,
          })
        )
      )
    );
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.config.bucketName,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Calculate file checksum
   */
  static calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Move file to new location
   */
  async moveFile(oldKey: string, newKey: string): Promise<void> {
    // Copy to new location
    const copyCommand = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: newKey,
      CopySource: `${this.config.bucketName}/${oldKey}`,
    });

    await this.s3Client.send(copyCommand);

    // Delete old file
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.config.bucketName,
        Key: oldKey,
      })
    );
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string): Promise<any> {
    const command = new HeadObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    return {
      size: response.ContentLength,
      lastModified: response.LastModified,
      contentType: response.ContentType,
      metadata: response.Metadata,
    };
  }
}

// Default storage configuration
export const createStorageService = (): StorageService => {
  const config: StorageConfig = {
    bucketName: process.env.S3_BUCKET_NAME || 'torrey-portfolio-images',
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  };

  return new StorageService(config);
};

export default StorageService;

