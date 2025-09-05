// API routes for folder management
import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '../../lib/db';
import { OrganizationService } from '../../lib/organization';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGetFolders(req, res);
    case 'POST':
      return handleCreateFolder(req, res);
    case 'PATCH':
      return handleUpdateFolder(req, res);
    case 'DELETE':
      return handleDeleteFolder(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}

/**
 * Get folder tree structure
 */
async function handleGetFolders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const folders = await DatabaseService.getFolderTree();
    return res.status(200).json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return res.status(500).json({ error: 'Failed to fetch folders' });
  }
}

/**
 * Create new folder
 */
async function handleCreateFolder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, path, parentId } = req.body;

    if (!name || !path) {
      return res.status(400).json({ error: 'Name and path are required' });
    }

    const folder = await DatabaseService.createFolder(path, name, parentId);
    return res.status(201).json({ folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    return res.status(500).json({ error: 'Failed to create folder' });
  }
}

/**
 * Update folder
 */
async function handleUpdateFolder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, path, parentId } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: { name, path, parentId },
    });

    return res.status(200).json({ folder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return res.status(500).json({ error: 'Failed to update folder' });
  }
}

/**
 * Delete folder
 */
async function handleDeleteFolder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Check if folder has images
    const imageCount = await prisma.image.count({
      where: { folderId: id },
    });

    if (imageCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete folder with images. Move or delete images first.' 
      });
    }

    // Check if folder has children
    const childCount = await prisma.folder.count({
      where: { parentId: id },
    });

    if (childCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete folder with subfolders. Delete subfolders first.' 
      });
    }

    await prisma.folder.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return res.status(500).json({ error: 'Failed to delete folder' });
  }
}

/**
 * Apply organization strategy to folder
 */
export async function applyOrganizationStrategy(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { folderId, strategy } = req.body;

    if (!folderId || !strategy) {
      return res.status(400).json({ error: 'Folder ID and strategy are required' });
    }

    // Get folder and its images
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { images: true },
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Create organization service with strategy
    const organizationService = new OrganizationService(strategy);

    // Reorganize images
    const results = [];
    for (const image of folder.images) {
      const metadata = {
        date: image.date ? new Date(image.date) : new Date(),
        slug: image.title?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        tags: image.tags || [],
        camera: image.camera,
        lens: image.lens,
        shortId: image.id.substring(0, 8),
        originalFilename: image.filename || 'unknown',
        extension: 'webp',
      };

      const newPath = organizationService.generateFolderPath(metadata);
      const newFilename = organizationService.generateFilename(metadata);

      // Create new folder if needed
      const newFolder = await DatabaseService.createFolder(newPath, path.basename(newPath));

      // Update image record
      await prisma.image.update({
        where: { id: image.id },
        data: {
          folderId: newFolder.id,
          filename: newFilename,
        },
      });

      results.push({
        imageId: image.id,
        oldPath: folder.path,
        newPath: newFolder.path,
        newFilename,
      });
    }

    return res.status(200).json({ 
      message: 'Organization strategy applied successfully',
      results,
    });
  } catch (error) {
    console.error('Error applying organization strategy:', error);
    return res.status(500).json({ error: 'Failed to apply organization strategy' });
  }
}

