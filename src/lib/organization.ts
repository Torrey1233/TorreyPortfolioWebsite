// Photo Organization Strategy Service
// Handles different folder organization strategies and filename templates

export interface OrganizationConfig {
  strategy: 'date_based' | 'post_based' | 'tag_based' | 'custom';
  filenameTemplate: string;
  folderTemplate: string;
  preserveOriginal: boolean;
  generateThumbnails: boolean;
}

export interface ImageMetadata {
  date?: Date;
  slug?: string;
  tags?: string[];
  camera?: string;
  lens?: string;
  shortId?: string;
  originalFilename: string;
  extension: string;
}

export class OrganizationService {
  private config: OrganizationConfig;

  constructor(config: OrganizationConfig) {
    this.config = config;
  }

  /**
   * Generate folder path based on strategy
   */
  generateFolderPath(metadata: ImageMetadata): string {
    switch (this.config.strategy) {
      case 'date_based':
        return this.generateDateBasedPath(metadata);
      case 'post_based':
        return this.generatePostBasedPath(metadata);
      case 'tag_based':
        return this.generateTagBasedPath(metadata);
      case 'custom':
        return this.generateCustomPath(metadata);
      default:
        return this.generateDateBasedPath(metadata);
    }
  }

  /**
   * Generate filename based on template
   */
  generateFilename(metadata: ImageMetadata): string {
    const template = this.config.filenameTemplate;
    const date = metadata.date || new Date();
    
    const replacements: Record<string, string> = {
      '${YYYY}': date.getFullYear().toString(),
      '${MM}': String(date.getMonth() + 1).padStart(2, '0'),
      '${DD}': String(date.getDate()).padStart(2, '0'),
      '${HH}': String(date.getHours()).padStart(2, '0'),
      '${mm}': String(date.getMinutes()).padStart(2, '0'),
      '${ss}': String(date.getSeconds()).padStart(2, '0'),
      '${slug}': metadata.slug || 'untitled',
      '${shortId}': metadata.shortId || this.generateShortId(),
      '${camera}': metadata.camera?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown',
      '${lens}': metadata.lens?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown',
      '${ext}': metadata.extension,
      '${basename}': metadata.originalFilename.replace(/\.[^/.]+$/, ''),
    };

    let filename = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      filename = filename.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return filename;
  }

  /**
   * Generate full S3 key for the image
   */
  generateS3Key(metadata: ImageMetadata): string {
    const folderPath = this.generateFolderPath(metadata);
    const filename = this.generateFilename(metadata);
    return `${folderPath}/${filename}`;
  }

  /**
   * Generate date-based folder structure: /photos/2025/09/11/
   */
  private generateDateBasedPath(metadata: ImageMetadata): string {
    const date = metadata.date || new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `photos/${year}/${month}/${day}`;
  }

  /**
   * Generate post-based folder structure: /posts/{slug}/
   */
  private generatePostBasedPath(metadata: ImageMetadata): string {
    const slug = metadata.slug || 'untitled';
    return `posts/${slug}`;
  }

  /**
   * Generate tag-based folder structure: /tags/{primary_tag}/
   */
  private generateTagBasedPath(metadata: ImageMetadata): string {
    const primaryTag = metadata.tags?.[0] || 'uncategorized';
    return `tags/${primaryTag}`;
  }

  /**
   * Generate custom folder structure based on template
   */
  private generateCustomPath(metadata: ImageMetadata): string {
    const template = this.config.folderTemplate;
    const date = metadata.date || new Date();
    
    const replacements: Record<string, string> = {
      '${YYYY}': date.getFullYear().toString(),
      '${MM}': String(date.getMonth() + 1).padStart(2, '0'),
      '${DD}': String(date.getDate()).padStart(2, '0'),
      '${slug}': metadata.slug || 'untitled',
      '${camera}': metadata.camera?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown',
    };

    let path = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      path = path.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });

    return path;
  }

  /**
   * Generate a short unique ID for the image
   */
  private generateShortId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  /**
   * Parse EXIF data to extract metadata
   */
  static parseExifData(exifData: any): Partial<ImageMetadata> {
    const metadata: Partial<ImageMetadata> = {};

    if (exifData.DateTimeOriginal) {
      metadata.date = new Date(exifData.DateTimeOriginal);
    } else if (exifData.DateTime) {
      metadata.date = new Date(exifData.DateTime);
    }

    if (exifData.Make && exifData.Model) {
      metadata.camera = `${exifData.Make} ${exifData.Model}`;
    }

    if (exifData.LensModel) {
      metadata.lens = exifData.LensModel;
    }

    return metadata;
  }
}

// Predefined organization strategies
export const ORGANIZATION_STRATEGIES = {
  date_based: {
    strategy: 'date_based' as const,
    filenameTemplate: '${YYYY}-${MM}-${DD}_${shortId}.${ext}',
    folderTemplate: 'photos/${YYYY}/${MM}/${DD}',
    preserveOriginal: true,
    generateThumbnails: true,
  },
  post_based: {
    strategy: 'post_based' as const,
    filenameTemplate: '${order}_${basename}.${ext}',
    folderTemplate: 'posts/${slug}',
    preserveOriginal: true,
    generateThumbnails: true,
  },
  tag_based: {
    strategy: 'tag_based' as const,
    filenameTemplate: '${YYYY}-${MM}-${DD}_${shortId}.${ext}',
    folderTemplate: 'tags/${primary_tag}',
    preserveOriginal: true,
    generateThumbnails: true,
  },
  custom: {
    strategy: 'custom' as const,
    filenameTemplate: '${YYYY}-${MM}-${DD}_${slug}_${shortId}.${ext}',
    folderTemplate: 'custom/${YYYY}/${MM}',
    preserveOriginal: true,
    generateThumbnails: true,
  },
};

export default OrganizationService;

