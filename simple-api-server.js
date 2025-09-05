// Simple API server for debugging
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

// Load environment variables
config();

// Explicitly set DATABASE_URL if not found
if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not found in environment, using fallback...');
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_XYlCF7gd5yeB@ep-fancy-resonance-adzmi9vp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
}

const app = express();
const PORT = 3001;
const prisma = new PrismaClient();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file (increased for high-res photos)
    files: 500 // 500 files max per upload (increased for large shoots)
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple API server is running' });
});

// Simple folders endpoint
app.get('/api/folders', async (req, res) => {
  try {
    console.log('Fetching folders...');
    const folders = await prisma.folder.findMany();
    console.log(`Found ${folders.length} folders`);
    res.json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders', details: error.message });
  }
});

// Simple albums endpoint
app.get('/api/albums', async (req, res) => {
  try {
    console.log('Fetching albums...');
    const albums = await prisma.album.findMany({
      include: {
        images: {
          include: {
            image: {
              include: {
                folder: true
              }
            }
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
    
    console.log(`Found ${albums.length} albums`);
    res.json({ albums: albumsWithCount });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Failed to fetch albums', details: error.message });
  }
});

// Simple images endpoint
app.get('/api/images', async (req, res) => {
  try {
    console.log('Fetching images...');
    const { limit = 1000, offset = 0 } = req.query;
    
    const images = await prisma.image.findMany({
      include: {
        folder: true
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });
    console.log(`Found ${images.length} images`);
    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

// Blog posts endpoints
app.get('/api/blog-posts', async (req, res) => {
  try {
    console.log('Fetching blog posts...');
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: 'desc' }
    });
    console.log(`Found ${blogPosts.length} blog posts`);
    res.json({ blogPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts', details: error.message });
  }
});

app.post('/api/blog-posts', async (req, res) => {
  try {
    console.log('Creating blog post...');
    const { title, slug, description, date, tags, featured, published } = req.body;
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        tags: tags || [],
        featured: featured || false,
        published: published || false,
        images: []
      }
    });
    
    console.log(`Created blog post: ${blogPost.title}`);
    res.status(201).json({ blogPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post', details: error.message });
  }
});

app.patch('/api/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, date, tags, featured, published, images } = req.body;
    
    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        date: date ? new Date(date) : undefined,
        tags,
        featured,
        published,
        images
      }
    });
    
    console.log(`Updated blog post: ${blogPost.title}`);
    res.json({ blogPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post', details: error.message });
  }
});

app.delete('/api/blog-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.blogPost.delete({
      where: { id }
    });
    
    console.log(`Deleted blog post: ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post', details: error.message });
  }
});

// Featured photos endpoints
app.get('/api/featured-photos', async (req, res) => {
  try {
    console.log('Fetching featured photos...');
    const { category } = req.query;
    
    const where = { featured: true };
    if (category) {
      where.category = category;
    }
    
    const featuredPhotos = await prisma.image.findMany({
      where,
      include: {
        folder: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${featuredPhotos.length} featured photos`);
    res.json({ featuredPhotos });
  } catch (error) {
    console.error('Error fetching featured photos:', error);
    res.status(500).json({ error: 'Failed to fetch featured photos', details: error.message });
  }
});

app.patch('/api/images/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    
    const image = await prisma.image.update({
      where: { id },
      data: { featured }
    });
    
    console.log(`Updated featured status for image: ${image.filename}`);
    res.json({ image });
  } catch (error) {
    console.error('Error updating featured status:', error);
    res.status(500).json({ error: 'Failed to update featured status', details: error.message });
  }
});

// Category management endpoints
app.get('/api/categories', async (req, res) => {
  try {
    console.log('Fetching categories...');
    
    // Get unique categories from images
    const categories = await prisma.image.findMany({
      select: { category: true },
      distinct: ['category'],
      where: {
        category: {
          not: null
        }
      }
    });
    
    const categoryList = categories.map(c => c.category).filter(Boolean);
    console.log(`Found categories: ${categoryList.join(', ')}`);
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', details: error.message });
  }
});

// Photo upload endpoints
app.post('/api/upload', upload.array('photos', 500), async (req, res) => {
  try {
    console.log('Uploading photos...');
    console.log('Files received:', req.files ? req.files.length : 0);
    console.log('Request body keys:', Object.keys(req.body || {}));
    console.log('Request files:', req.files ? req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname, size: f.size })) : 'none');
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedImages = [];
    const totalFiles = req.files.length;
    let processedCount = 0;
    
    console.log(`Processing ${totalFiles} files...`);
    
    for (const file of req.files) {
      try {
        processedCount++;
        console.log(`Processing ${processedCount}/${totalFiles}: ${file.originalname}`);
        
        // Generate checksum for deduplication
        const fileBuffer = fs.readFileSync(file.path);
        const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        // Check if image already exists
        const existingImage = await prisma.image.findUnique({
          where: { checksum }
        });
        
        if (existingImage) {
          // Delete duplicate file
          fs.unlinkSync(file.path);
          console.log(`Skipped duplicate: ${file.originalname}`);
          continue;
        }
        
        // Generate thumbnail
        const thumbnailDir = path.join(__dirname, 'public', 'images', 'thumbnails');
        if (!fs.existsSync(thumbnailDir)) {
          fs.mkdirSync(thumbnailDir, { recursive: true });
        }
        
        const thumbnailPath = path.join(thumbnailDir, file.filename);
        await sharp(file.path)
          .resize(200, 200, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(thumbnailPath);
        
        // Create image record in database
        const image = await prisma.image.create({
          data: {
            filename: file.filename,
            checksum: checksum,
            title: path.parse(file.originalname).name,
            category: 'uploads', // Default category for uploaded photos
            tags: [],
            featured: false
          }
        });
        
        uploadedImages.push({
          id: image.id,
          filename: image.filename,
          title: image.title,
          url: `/images/uploads/${file.filename}`,
          thumbnail: `/images/thumbnails/${file.filename}`
        });
        
        console.log(`Uploaded: ${file.originalname} -> ${file.filename} (${processedCount}/${totalFiles})`);
        
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        // Clean up failed file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    console.log(`Successfully uploaded ${uploadedImages.length} images`);
    res.json({ 
      success: true, 
      uploaded: uploadedImages.length,
      images: uploadedImages 
    });
    
  } catch (error) {
    console.error('Error uploading photos:', error);
    
    // Handle multer errors specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB per file.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 500 files per upload.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name. Please use the correct upload form.' });
    }
    
    res.status(500).json({ error: 'Failed to upload photos', details: error.message });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.error('Multer error:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB per file.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 500 files per upload.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected field name. Please use the correct upload form.' });
    }
  }
  next(error);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
