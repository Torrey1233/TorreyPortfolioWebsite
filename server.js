// Express server for API routes
import express from 'express';
import cors from 'cors';
import { DatabaseService } from './src/lib/db.ts';
import { prisma } from './src/lib/db.ts';

const app = express();
const PORT = 3001;

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

    const album = await DatabaseService.createAlbum({
      name,
      slug,
      description,
      coverImageId,
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
    const folders = await DatabaseService.getFolderTree();
    res.json({ folders });
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

    const folder = await DatabaseService.createFolder(path, name, parentId);
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

    const filters = {};

    if (category) filters.category = category;
    if (tags) filters.tags = tags.split(',');
    if (dateFrom) filters.dateFrom = new Date(dateFrom);
    if (dateTo) filters.dateTo = new Date(dateTo);
    if (camera) filters.camera = camera;
    if (lens) filters.lens = lens;
    if (featured !== undefined) filters.featured = featured === 'true';
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);

    const images = await DatabaseService.searchImages(filters);

    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Import API Routes
app.get('/api/import', async (req, res) => {
  try {
    const jobs = await DatabaseService.getImportJobs();
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

    // For now, just create a mock import job
    const job = await DatabaseService.createImportJob({
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
