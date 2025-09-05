// Import Job Service for bulk photo import and organization
import { DatabaseService } from './db';
import { StorageService } from './storage';
import { OrganizationService, ImageMetadata } from './organization';
import { promises as fs } from 'fs';
import path from 'path';
import ExifReader from 'exifreader';

export interface ImportConfig {
  sourcePath: string;
  mode: 'SCAN_ONLY' | 'INGEST_MOVE' | 'INGEST_COPY';
  organizationStrategy: string;
  deduplicate: boolean;
  generateThumbnails: boolean;
  preserveOriginals: boolean;
  tags?: string[];
  category?: string;
  slug?: string;
}

export interface ImportProgress {
  total: number;
  processed: number;
  created: number;
  skipped: number;
  deduped: number;
  errors: number;
  currentFile?: string;
}

export class ImportService {
  private storageService: StorageService;
  private organizationService: OrganizationService;

  constructor(storageService: StorageService, organizationService: OrganizationService) {
    this.storageService = storageService;
    this.organizationService = organizationService;
  }

  /**
   * Start import job
   */
  async startImportJob(config: ImportConfig): Promise<string> {
    const job = await DatabaseService.createImportJob({
      sourcePath: config.sourcePath,
      mode: config.mode,
      config,
    });

    // Start processing in background
    this.processImportJob(job.id, config).catch(error => {
      console.error(`Import job ${job.id} failed:`, error);
      DatabaseService.updateImportJob(job.id, {
        status: 'FAILED',
        log: error.message,
        finishedAt: new Date(),
      });
    });

    return job.id;
  }

  /**
   * Process import job
   */
  private async processImportJob(jobId: string, config: ImportConfig): Promise<void> {
    await DatabaseService.updateImportJob(jobId, { status: 'RUNNING' });

    try {
      const files = await this.scanDirectory(config.sourcePath);
      const progress: ImportProgress = {
        total: files.length,
        processed: 0,
        created: 0,
        skipped: 0,
        deduped: 0,
        errors: 0,
      };

      for (const filePath of files) {
        progress.currentFile = path.basename(filePath);
        
        try {
          await this.processFile(filePath, config, progress);
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          progress.errors++;
        }

        progress.processed++;
        
        // Update progress every 10 files
        if (progress.processed % 10 === 0) {
          await DatabaseService.updateImportJob(jobId, {
            created: progress.created,
            skipped: progress.skipped,
            deduped: progress.deduped,
            errors: progress.errors,
            log: `Processed ${progress.processed}/${progress.total} files`,
          });
        }
      }

      await DatabaseService.updateImportJob(jobId, {
        status: 'DONE',
        created: progress.created,
        skipped: progress.skipped,
        deduped: progress.deduped,
        errors: progress.errors,
        log: `Import completed. Created: ${progress.created}, Skipped: ${progress.skipped}, Deduped: ${progress.deduped}, Errors: ${progress.errors}`,
        finishedAt: new Date(),
      });

    } catch (error) {
      await DatabaseService.updateImportJob(jobId, {
        status: 'FAILED',
        log: error.message,
        finishedAt: new Date(),
      });
      throw error;
    }
  }

  /**
   * Process individual file
   */
  private async processFile(
    filePath: string,
    config: ImportConfig,
    progress: ImportProgress
  ): Promise<void> {
    const buffer = await fs.readFile(filePath);
    const checksum = StorageService.calculateChecksum(buffer);
    
    // Check for duplicates
    if (config.deduplicate) {
      const duplicates = await DatabaseService.findDuplicates(checksum);
      if (duplicates.length > 0) {
        progress.deduped++;
        return;
      }
    }

    // Extract metadata
    const metadata = await this.extractMetadata(filePath, buffer, config);
    
    // Generate S3 key
    const s3Key = this.organizationService.generateS3Key(metadata);
    
    // Check if file already exists in storage
    const exists = await this.storageService.fileExists(`originals/${s3Key}`);
    if (exists) {
      progress.skipped++;
      return;
    }

    // Upload to storage
    const variants = await this.storageService.uploadImage(
      s3Key,
      buffer,
      this.getMimeType(filePath),
      {
        originalPath: filePath,
        importJob: 'true',
      }
    );

    // Create folder if needed
    const folderPath = this.organizationService.generateFolderPath(metadata);
    const folder = await DatabaseService.createFolder(
      folderPath,
      path.basename(folderPath)
    );

    // Create database record
    await DatabaseService.createImage({
      checksum,
      filename: s3Key,
      folderId: folder.id,
      title: metadata.originalFilename.replace(/\.[^/.]+$/, ''),
      category: config.category || metadata.tags?.[0] || 'imported',
      date: metadata.date?.toISOString(),
      location: metadata.location,
      description: `Imported from ${filePath}`,
      camera: metadata.camera,
      lens: metadata.lens,
      settings: metadata.settings,
      tags: config.tags || metadata.tags || [],
      featured: false,
    });

    // Move or copy file based on mode
    if (config.mode === 'INGEST_MOVE') {
      // Move file to processed location
      const processedPath = path.join(config.sourcePath, '..', 'processed', s3Key);
      await fs.mkdir(path.dirname(processedPath), { recursive: true });
      await fs.rename(filePath, processedPath);
    }

    progress.created++;
  }

  /**
   * Scan directory for image files
   */
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'];

    const scanRecursive = async (currentPath: string): Promise<void> => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        
        if (entry.isDirectory()) {
          await scanRecursive(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (allowedExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    };

    await scanRecursive(dirPath);
    return files;
  }

  /**
   * Extract metadata from image file
   */
  private async extractMetadata(
    filePath: string,
    buffer: Buffer,
    config: ImportConfig
  ): Promise<ImageMetadata> {
    const filename = path.basename(filePath);
    const extension = path.extname(filename).slice(1);
    
    let exifData: any = {};
    try {
      exifData = ExifReader.load(buffer);
    } catch (error) {
      console.warn(`Could not read EXIF data from ${filename}:`, error);
    }

    const metadata: ImageMetadata = {
      originalFilename: filename,
      extension,
      tags: config.tags || [],
      slug: config.slug,
    };

    // Parse EXIF data
    if (exifData.DateTimeOriginal) {
      metadata.date = new Date(exifData.DateTimeOriginal);
    } else if (exifData.DateTime) {
      metadata.date = new Date(exifData.DateTime);
    } else {
      // Use file modification time as fallback
      const stats = await fs.stat(filePath);
      metadata.date = stats.mtime;
    }

    if (exifData.Make && exifData.Model) {
      metadata.camera = `${exifData.Make} ${exifData.Model}`;
    }

    if (exifData.LensModel) {
      metadata.lens = exifData.LensModel;
    }

    // Generate short ID
    metadata.shortId = this.generateShortId();

    return metadata;
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Generate short unique ID
   */
  private generateShortId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  /**
   * Get import job status
   */
  async getImportJobStatus(jobId: string) {
    return await DatabaseService.getImportJob(jobId);
  }

  /**
   * Get all import jobs
   */
  async getAllImportJobs() {
    return await DatabaseService.getImportJobs();
  }

  /**
   * Cancel import job
   */
  async cancelImportJob(jobId: string) {
    return await DatabaseService.updateImportJob(jobId, {
      status: 'FAILED',
      log: 'Import job cancelled by user',
      finishedAt: new Date(),
    });
  }
}

export default ImportService;

