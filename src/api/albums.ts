// API routes for album management
import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '../../lib/db';
import { prisma } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetAlbums(req, res);
    case 'POST':
      return handleCreateAlbum(req, res);
    case 'PATCH':
      return handleUpdateAlbum(req, res);
    case 'DELETE':
      return handleDeleteAlbum(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}

/**
 * Get all albums
 */
async function handleGetAlbums(req: NextApiRequest, res: NextApiResponse) {
  try {
    const albums = await prisma.album.findMany({
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
        _count: {
          select: { images: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return res.status(500).json({ error: 'Failed to fetch albums' });
  }
}

/**
 * Create new album
 */
async function handleCreateAlbum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, slug, description, coverImageId } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const album = await DatabaseService.createAlbum({
      name,
      slug,
      description,
      coverImageId,
    });

    return res.status(201).json({ album });
  } catch (error) {
    console.error('Error creating album:', error);
    return res.status(500).json({ error: 'Failed to create album' });
  }
}

/**
 * Update album
 */
async function handleUpdateAlbum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, slug, description, coverImageId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    const album = await prisma.album.update({
      where: { id },
      data: { name, slug, description, coverImageId },
    });

    return res.status(200).json({ album });
  } catch (error) {
    console.error('Error updating album:', error);
    return res.status(500).json({ error: 'Failed to update album' });
  }
}

/**
 * Delete album
 */
async function handleDeleteAlbum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    await prisma.album.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    return res.status(500).json({ error: 'Failed to delete album' });
  }
}

/**
 * Add images to album
 */
export async function addImagesToAlbum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { albumId } = req.query;
    const { imageIds } = req.body;

    if (!albumId || typeof albumId !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    if (!imageIds || !Array.isArray(imageIds)) {
      return res.status(400).json({ error: 'Image IDs array is required' });
    }

    // Verify album exists
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Add images to album
    await DatabaseService.addImagesToAlbum(albumId, imageIds);

    return res.status(200).json({ message: 'Images added to album successfully' });
  } catch (error) {
    console.error('Error adding images to album:', error);
    return res.status(500).json({ error: 'Failed to add images to album' });
  }
}

/**
 * Remove image from album
 */
export async function removeImageFromAlbum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { albumId, imageId } = req.query;

    if (!albumId || typeof albumId !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    if (!imageId || typeof imageId !== 'string') {
      return res.status(400).json({ error: 'Image ID is required' });
    }

    await prisma.albumImage.deleteMany({
      where: {
        albumId,
        imageId,
      },
    });

    return res.status(200).json({ message: 'Image removed from album successfully' });
  } catch (error) {
    console.error('Error removing image from album:', error);
    return res.status(500).json({ error: 'Failed to remove image from album' });
  }
}

/**
 * Reorder images in album
 */
export async function reorderAlbumImages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { albumId } = req.query;
    const { imageOrders } = req.body; // Array of { imageId, order }

    if (!albumId || typeof albumId !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    if (!imageOrders || !Array.isArray(imageOrders)) {
      return res.status(400).json({ error: 'Image orders array is required' });
    }

    // Update image orders
    await Promise.all(
      imageOrders.map(({ imageId, order }: { imageId: string; order: number }) =>
        prisma.albumImage.updateMany({
          where: {
            albumId,
            imageId,
          },
          data: { order },
        })
      )
    );

    return res.status(200).json({ message: 'Album images reordered successfully' });
  } catch (error) {
    console.error('Error reordering album images:', error);
    return res.status(500).json({ error: 'Failed to reorder album images' });
  }
}

/**
 * Get album with images
 */
export async function getAlbumWithImages(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Album ID is required' });
    }

    const album = await DatabaseService.getAlbumWithImages(id);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    return res.status(200).json({ album });
  } catch (error) {
    console.error('Error fetching album:', error);
    return res.status(500).json({ error: 'Failed to fetch album' });
  }
}

