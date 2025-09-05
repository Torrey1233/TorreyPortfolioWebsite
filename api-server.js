// Simple Express API server for photo management
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Albums API Routes
app.get('/api/albums', async (req, res) => {
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

    res.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

app.post('/api/albums', async (req, res) => {
  try {
    const { name, slug, description, coverImageId } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const album = await prisma.album.create({
      data: {
        name,
        slug,
        description,
        coverImageId,
      },
    });

    res.status(201).json({ album });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

app.patch('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, coverImageId } = req.body;

    const album = await prisma.album.update({
      where: { id },
      data: { name, slug, description, coverImageId },
    });

    res.json({ album });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Failed to update album' });
  }
});

app.delete('/api/albums/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.album.delete({
      where: { id },
    });

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

// Folders API Routes
app.get('/api/folders', async (req, res) => {
  try {
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
    const rootFolders = [];

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

    res.json({ folders: rootFolders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

app.post('/api/folders', async (req, res) => {
  try {
    const { name, path, parentId } = req.body;

    if (!name || !path) {
      return res.status(400).json({ error: 'Name and path are required' });
    }

    const folder = await prisma.folder.upsert({
      where: { path },
      update: { name, parentId },
      create: { path, name, parentId },
    });

    res.status(201).json({ folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Images API Routes
app.get('/api/images', async (req, res) => {
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

    const where = {};

    if (category) where.category = category;
    if (tags) where.tags = { hasSome: tags.split(',') };
    if (dateFrom) where.date = { gte: new Date(dateFrom) };
    if (dateTo) where.date = { lte: new Date(dateTo) };
    if (camera) where.camera = { contains: camera, mode: 'insensitive' };
    if (lens) where.lens = { contains: lens, mode: 'insensitive' };
    if (featured !== undefined) where.featured = featured === 'true';

    const images = await prisma.image.findMany({
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
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Import API Routes
app.get('/api/import', async (req, res) => {
  try {
    const jobs = await prisma.importJob.findMany({
      orderBy: { startedAt: 'desc' },
    });
    res.json({ jobs });
  } catch (error) {
    console.error('Error fetching import jobs:', error);
    res.status(500).json({ error: 'Failed to fetch import jobs' });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const {
      sourcePath,
      mode,
      organizationStrategy,
      deduplicate,
      generateThumbnails,
      preserveOriginals,
      tags,
      category,
      slug,
    } = req.body;

    if (!sourcePath || !mode) {
      return res.status(400).json({ error: 'Source path and mode are required' });
    }

    // Create a mock import job for now
    const job = await prisma.importJob.create({
      data: {
        sourcePath,
        mode,
        config: {
          organizationStrategy,
          deduplicate,
          generateThumbnails,
          preserveOriginals,
          tags,
          category,
          slug,
        },
      },
    });

    res.status(201).json({ 
      message: 'Import job started successfully',
      jobId: job.id,
    });
  } catch (error) {
    console.error('Error starting import job:', error);
    res.status(500).json({ error: 'Failed to start import job' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
