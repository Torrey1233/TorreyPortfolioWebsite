// Real API server with PostgreSQL database
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Load environment variables
config();

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/images/uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

// Helper function to generate checksum
function generateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real API server is running' });
});

// Folders endpoints
app.get('/api/folders', async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        images: true
      },
      orderBy: { name: 'asc' }
    });
    
    // Add count manually since _count might not work in all Prisma versions
    const foldersWithCount = folders.map(folder => ({
      ...folder,
      _count: { images: folder.images.length }
    }));
    
    res.json({ folders: foldersWithCount });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

app.post('/api/folders', async (req, res) => {
  try {
    const { name, path, parentId } = req.body;
    
    const folder = await prisma.folder.create({
      data: {
        name,
        path,
        parentId: parentId || null
      },
      include: {
        images: true,
        _count: {
          select: { images: true }
        }
      }
    });
    
    res.status(201).json({ folder });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create folder' });
  }
});

// Albums endpoints
app.get('/api/albums', async (req, res) => {
  try {
    const albums = await prisma.album.findMany({
      include: {
        images: {
          include: {
            image: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Add count manually
    const albumsWithCount = albums.map(album => ({
      ...album,
      _count: { images: album.images.length }
    }));
    
    res.json({ albums: albumsWithCount });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

app.post('/api/albums', async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    
    const album = await prisma.album.create({
      data: {
        name,
        slug,
        description
      },
      include: {
        images: {
          include: {
            image: true
          }
        },
        _count: {
          select: { images: true }
        }
      }
    });
    
    res.status(201).json({ album });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Images endpoints
app.get('/api/images', async (req, res) => {
  try {
    const { folderId, albumId, limit = 50, offset = 0 } = req.query;
    
    const where = {};
    if (folderId) where.folderId = folderId;
    
    const images = await prisma.image.findMany({
      where,
      include: {
        folder: true,
        albumImages: albumId ? {
          where: { albumId }
        } : true
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });
    
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Upload image endpoint
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const { folderId, title, description, tags } = req.body;
    const filePath = req.file.path;
    const checksum = generateChecksum(filePath);
    
    // Check for duplicates
    const existingImage = await prisma.image.findUnique({
      where: { checksum }
    });
    
    if (existingImage) {
      // Delete the uploaded file since it's a duplicate
      fs.unlinkSync(filePath);
      return res.status(409).json({ 
        error: 'Duplicate image detected',
        existingImage 
      });
    }
    
    // Create image record
    const image = await prisma.image.create({
      data: {
        filename: req.file.filename,
        checksum,
        title: title || req.file.originalname,
        description,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        folderId: folderId || null
      },
      include: {
        folder: true
      }
    });
    
    res.status(201).json({ image });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Bulk import endpoint
app.post('/api/import/bulk', async (req, res) => {
  try {
    const { sourcePath, folderId, albumId } = req.body;
    
    if (!fs.existsSync(sourcePath)) {
      return res.status(400).json({ error: 'Source path does not exist' });
    }
    
    const files = fs.readdirSync(sourcePath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    
    const results = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 0,
      images: []
    };
    
    for (const file of files) {
      try {
        const filePath = path.join(sourcePath, file);
        const checksum = generateChecksum(filePath);
        
        // Check for duplicates
        const existingImage = await prisma.image.findUnique({
          where: { checksum }
        });
        
        if (existingImage) {
          results.skipped++;
          continue;
        }
        
        // Copy file to uploads directory
        const uploadPath = 'public/images/uploads';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        const newFilename = `${Date.now()}-${file}`;
        const newFilePath = path.join(uploadPath, newFilename);
        fs.copyFileSync(filePath, newFilePath);
        
        // Create image record
        const image = await prisma.image.create({
          data: {
            filename: newFilename,
            checksum,
            title: path.parse(file).name,
            folderId: folderId || null
          },
          include: {
            folder: true
          }
        });
        
        results.created++;
        results.images.push(image);
        
        // Add to album if specified
        if (albumId) {
          await prisma.albumImage.create({
            data: {
              albumId,
              imageId: image.id,
              order: results.created
            }
          });
        }
        
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        results.errors++;
      }
      
      results.processed++;
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error in bulk import:', error);
    res.status(500).json({ error: 'Failed to import images' });
  }
});

// Import jobs endpoints
app.get('/api/import', async (req, res) => {
  try {
    const importJobs = await prisma.importJob.findMany({
      orderBy: { startedAt: 'desc' }
    });
    res.json({ importJobs });
  } catch (error) {
    console.error('Error fetching import jobs:', error);
    res.status(500).json({ error: 'Failed to fetch import jobs' });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const { sourcePath, mode } = req.body;
    
    const importJob = await prisma.importJob.create({
      data: {
        sourcePath,
        mode: mode || 'SCAN_ONLY',
        status: 'PENDING'
      }
    });
    
    res.status(201).json({ importJob });
  } catch (error) {
    console.error('Error creating import job:', error);
    res.status(500).json({ error: 'Failed to create import job' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Real API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Database: PostgreSQL with Prisma`);
});

export default app;
