// Database client and utilities
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database utility functions
export class DatabaseService {
  /**
   * Create or update folder structure
   */
  static async createFolder(path: string, name: string, parentId?: string) {
    return await prisma.folder.upsert({
      where: { path },
      update: { name, parentId },
      create: { path, name, parentId },
    });
  }

  /**
   * Get folder tree structure
   */
  static async getFolderTree() {
    const folders = await prisma.folder.findMany({
      include: {
        children: true,
        images: {
          select: { id: true },
        },
        _count: {
          select: { images: true },
        },
      },
      orderBy: { path: 'asc' },
    });

    // Build tree structure
    const folderMap = new Map();
    const rootFolders: any[] = [];

    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    folders.forEach(folder => {
      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(folderMap.get(folder.id));
        }
      } else {
        rootFolders.push(folderMap.get(folder.id));
      }
    });

    return rootFolders;
  }

  /**
   * Create or update image record
   */
  static async createImage(data: {
    checksum?: string;
    filename?: string;
    folderId?: string;
    title?: string;
    category?: string;
    date?: string;
    location?: string;
    description?: string;
    camera?: string;
    lens?: string;
    settings?: any;
    tags?: string[];
    featured?: boolean;
  }) {
    return await prisma.image.create({
      data,
    });
  }

  /**
   * Find duplicate images by checksum
   */
  static async findDuplicates(checksum: string) {
    return await prisma.image.findMany({
      where: { checksum },
      include: { folder: true },
    });
  }

  /**
   * Create album
   */
  static async createAlbum(data: {
    name: string;
    slug: string;
    description?: string;
    coverImageId?: string;
  }) {
    return await prisma.album.create({
      data,
    });
  }

  /**
   * Add images to album
   */
  static async addImagesToAlbum(albumId: string, imageIds: string[]) {
    const albumImages = imageIds.map((imageId, index) => ({
      albumId,
      imageId,
      order: index,
    }));

    return await prisma.albumImage.createMany({
      data: albumImages,
      skipDuplicates: true,
    });
  }

  /**
   * Get album with images
   */
  static async getAlbumWithImages(albumId: string) {
    return await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        images: {
          include: {
            image: {
              include: { folder: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        coverImage: true,
      },
    });
  }

  /**
   * Create import job
   */
  static async createImportJob(data: {
    sourcePath: string;
    mode: 'SCAN_ONLY' | 'INGEST_MOVE' | 'INGEST_COPY';
    config?: any;
  }) {
    return await prisma.importJob.create({
      data,
    });
  }

  /**
   * Update import job status
   */
  static async updateImportJob(
    id: string,
    data: {
      status?: 'PENDING' | 'RUNNING' | 'DONE' | 'FAILED';
      created?: number;
      skipped?: number;
      deduped?: number;
      errors?: number;
      log?: string;
      finishedAt?: Date;
    }
  ) {
    return await prisma.importJob.update({
      where: { id },
      data,
    });
  }

  /**
   * Get import job status
   */
  static async getImportJob(id: string) {
    return await prisma.importJob.findUnique({
      where: { id },
    });
  }

  /**
   * Get all import jobs
   */
  static async getImportJobs() {
    return await prisma.importJob.findMany({
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Search images with filters
   */
  static async searchImages(filters: {
    category?: string;
    tags?: string[];
    dateFrom?: Date;
    dateTo?: Date;
    camera?: string;
    lens?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.tags && filters.tags.length > 0) {
      where.tags = {
        hasSome: filters.tags,
      };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = filters.dateFrom.toISOString();
      }
      if (filters.dateTo) {
        where.date.lte = filters.dateTo.toISOString();
      }
    }

    if (filters.camera) {
      where.camera = {
        contains: filters.camera,
        mode: 'insensitive',
      };
    }

    if (filters.lens) {
      where.lens = {
        contains: filters.lens,
        mode: 'insensitive',
      };
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    return await prisma.image.findMany({
      where,
      include: {
        folder: true,
        albumImages: {
          include: {
            album: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
  }
}

export default DatabaseService;

