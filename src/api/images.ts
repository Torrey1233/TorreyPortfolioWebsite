// API routes for image management
import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '../../lib/db';
import { StorageService, createStorageService } from '../../lib/storage';
import { OrganizationService, ORGANIZATION_STRATEGIES } from '../../lib/organization';
import { prisma } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetImages(req, res);
    case 'POST':
      return handleUploadImage(req, res);
    case 'PATCH':
      return handleUpdateImage(req, res);
    case 'DELETE':
      return handleDeleteImage(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}

/**
 * Get images with filters
 */
async function handleGetImages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      category,
      tags,
      dateFrom,
      dateTo,
      camera,
      lens,
      featured,
      limit = '50',
      offset = '0',
    } = req.query;

    const filters: any = {};

    if (category) filters.category = category as string;
    if (tags) filters.tags = (tags as string).split(',');
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (camera) filters.camera = camera as string;
    if (lens) filters.lens = lens as string;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (limit) filters.limit = parseInt(limit as string);
    if (offset) filters.offset = parseInt(offset as string);

    const images = await DatabaseService.searchImages(filters);

    // Get signed URLs for each image
    const storageService = createStorageService();
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        if (image.filename) {
          const urls = await storageService.getImageUrls(image.filename);
          return { ...image, urls };
        }
        return image;
      })
    );

    return res.status(200).json({ images: imagesWithUrls });
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ error: 'Failed to fetch images' });
  }
}

/**
 * Upload new image
 */
async function handleUploadImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    // This would typically use multer middleware for file upload
    // For now, we'll return a placeholder response
    return res.status(501).json({ error: 'File upload not implemented yet' });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
}

/**
 * Update image metadata
 */
async function handleUpdateImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    const image = await prisma.image.update({
      where: { id },
      data: updateData,
      include: { folder: true },
    });

    return res.status(200).json({ image });
  } catch (error) {
    console.error('Error updating image:', error);
    return res.status(500).json({ error: 'Failed to update image' });
  }
}

/**
 * Delete image
 */
async function handleDeleteImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    // Get image details
    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Delete from storage if filename exists
    if (image.filename) {
      const storageService = createStorageService();
      await storageService.deleteImage(image.filename);
    }

    // Delete from database
    await prisma.image.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
}

/**
 * Rename image
 */
export async function renameImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { newFilename } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    if (!newFilename) {
      return res.status(400).json({ error: 'New filename is required' });
    }

    const image = await prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (!image.filename) {
      return res.status(400).json({ error: 'Image has no filename to rename' });
    }

    // Move file in storage
    const storageService = createStorageService();
    await storageService.moveFile(image.filename, newFilename);

    // Update database
    const updatedImage = await prisma.image.update({
      where: { id },
      data: { filename: newFilename },
    });

    return res.status(200).json({ image: updatedImage });
  } catch (error) {
    console.error('Error renaming image:', error);
    return res.status(500).json({ error: 'Failed to rename image' });
  }
}

/**
 * Move image to different folder
 */
export async function moveImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { folderId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Verify folder exists
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Update image
    const image = await prisma.image.update({
      where: { id },
      data: { folderId },
      include: { folder: true },
    });

    return res.status(200).json({ image });
  } catch (error) {
    console.error('Error moving image:', error);
    return res.status(500).json({ error: 'Failed to move image' });
  }
}

/**
 * Find duplicate images
 */
export async function findDuplicates(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { checksum } = req.query;

    if (!checksum || typeof checksum !== 'string') {
      return res.status(400).json({ error: 'Checksum is required' });
    }

    const duplicates = await DatabaseService.findDuplicates(checksum);
    return res.status(200).json({ duplicates });
  } catch (error) {
    console.error('Error finding duplicates:', error);
    return res.status(500).json({ error: 'Failed to find duplicates' });
  }
}

/**
 * Scan for duplicate images
 */
export async function scanDuplicates(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all images with checksums
    const images = await prisma.image.findMany({
      where: {
        checksum: { not: null },
      },
      select: {
        id: true,
        filename: true,
        checksum: true,
        title: true,
      },
    });

    // Group by checksum
    const checksumGroups: Record<string, any[]> = {};
    images.forEach(image => {
      if (image.checksum) {
        if (!checksumGroups[image.checksum]) {
          checksumGroups[image.checksum] = [];
        }
        checksumGroups[image.checksum].push(image);
      }
    });

    // Find duplicates (groups with more than one image)
    const duplicates = Object.values(checksumGroups).filter(group => group.length > 1);

    return res.status(200).json({ 
      duplicates,
      totalImages: images.length,
      duplicateGroups: duplicates.length,
    });
  } catch (error) {
    console.error('Error scanning for duplicates:', error);
    return res.status(500).json({ error: 'Failed to scan for duplicates' });
  }
}

