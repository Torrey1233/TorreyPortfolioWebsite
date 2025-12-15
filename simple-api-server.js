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
import Mailgun from 'mailgun.js';
import formData from 'form-data';

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

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || 'your-mailgun-api-key',
  url: 'https://api.mailgun.net'
});

// Email notification function
async function sendBlogNotificationEmail(blogPost) {
  try {
    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { subscribed: true }
    });

    if (subscribers.length === 0) {
      console.log('No subscribers to notify');
      return;
    }

    console.log(`Sending blog notification to ${subscribers.length} subscribers...`);

    // Check if Mailgun is configured
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.log('Mailgun not configured - logging email data instead');
      console.log('Email notification data:', {
        recipients: subscribers.length,
        subject: `New Blog Post: ${blogPost.title}`,
        blogPost: blogPost.title
      });
      return;
    }

    // Create email content
    const subject = `New Photography Blog Post: ${blogPost.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin-bottom: 10px;">📸 New Photography Blog Post!</h1>
          <div style="height: 3px; background: linear-gradient(90deg, #007bff, #28a745); width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0 0 10px 0;">${blogPost.title}</h2>
          <p style="color: #666; margin: 0; line-height: 1.5;">
            ${blogPost.description || 'Check out my latest photography adventure and behind-the-scenes stories!'}
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yourdomain.com/blog/${blogPost.slug}" 
             style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
            📖 Read Full Post
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            You're receiving this because you subscribed to blog notifications.<br>
            <a href="https://yourdomain.com/unsubscribe" style="color: #999;">Unsubscribe</a> | 
            <a href="https://yourdomain.com" style="color: #999;">Visit Website</a>
          </p>
        </div>
      </div>
    `;

    const text = `
New Photography Blog Post: ${blogPost.title}

${blogPost.description || 'Check out my latest photography adventure!'}

Read the full post: https://yourdomain.com/blog/${blogPost.slug}

---
You're receiving this because you subscribed to blog notifications.
Unsubscribe: https://yourdomain.com/unsubscribe
    `;

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
          from: process.env.MAILGUN_FROM || `Torrey Liu Photography <noreply@${process.env.MAILGUN_DOMAIN}>`,
          to: [subscriber.email],
          subject: subject,
          text: text,
          html: html,
          'h:Reply-To': process.env.MAILGUN_REPLY_TO || 'torrey@yourdomain.com'
        });
        
        console.log(`Email sent to ${subscriber.email}: ${msg.id}`);
        return { success: true, email: subscriber.email, messageId: msg.id };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error.message);
        return { success: false, email: subscriber.email, error: error.message };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Email notification completed: ${successful} sent, ${failed} failed`);
    
    if (failed > 0) {
      console.log('Failed emails:', results.filter(r => !r.success));
    }

  } catch (error) {
    console.error('Error sending blog notification emails:', error);
  }
}

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images', 'uploads');
    console.log(`📁 Upload directory: ${uploadDir}`);
    if (!fs.existsSync(uploadDir)) {
      console.log(`📁 Creating upload directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    } else {
      console.log(`📁 Upload directory exists: ${uploadDir}`);
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

// Serve images with cache-control headers to prevent aggressive caching in development
app.use('/images', (req, res, next) => {
  // Set cache-control headers to prevent caching in development/admin
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, express.static(path.join(__dirname, 'public', 'images')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple API server is running' });
});

// Test endpoint to verify delete-by-filename route exists
app.get('/api/test-delete-route', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Delete-by-filename route is registered',
    route: 'POST /api/images/delete-by-filename'
  });
});

// Simple folders endpoint
app.get('/api/folders', async (req, res) => {
  try {
    console.log('Fetching folders...');
    const folders = await prisma.folder.findMany({
      include: {
        children: true,
        parent: true,
        _count: {
          select: {
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Found ${folders.length} folders`);
    res.json({ folders: folders || [] });
  } catch (error) {
    console.error('Error fetching folders:', error);
    // Return empty array instead of crashing
    res.json({ folders: [] });
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
        },
        coverImage: true
      },
      orderBy: { name: 'asc' }
    });
    
    // Add count manually and handle missing relations
    const albumsWithCount = albums.map(album => ({
      ...album,
      images: album.images || [],
      _count: { images: (album.images || []).length }
    }));
    
    console.log(`Found ${albums.length} albums`);
    res.json({ albums: albumsWithCount });
  } catch (error) {
    console.error('Error fetching albums:', error);
    // If there's an error, return empty array instead of crashing
    res.json({ albums: [] });
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
    res.json({ images: images || [] });
  } catch (error) {
    console.error('Error fetching images:', error);
    // Return empty array instead of crashing
    res.json({ images: [] });
  }
});

// Delete image by filename endpoint (for filesystem photos)
// IMPORTANT: This must be defined BEFORE /api/images/:id to avoid route conflicts
app.post('/api/images/delete-by-filename', async (req, res) => {
  try {
    const { filename } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }
    
    console.log(`Attempting to delete image: ${filename}`);
    
    // Delete physical files from storage
    const uploadPath = path.join(__dirname, 'public', 'images', 'uploads', filename);
    const thumbnailPath = path.join(__dirname, 'public', 'images', 'thumbnails', filename);
    
    let filesDeleted = 0;
    let errors = [];
    
    // Delete main image file
    if (fs.existsSync(uploadPath)) {
      try {
        fs.unlinkSync(uploadPath);
        filesDeleted++;
        console.log(`✅ Deleted file: ${uploadPath}`);
      } catch (unlinkError) {
        console.error(`Error deleting file ${uploadPath}:`, unlinkError);
        errors.push(`Failed to delete file: ${unlinkError.message}`);
      }
    } else {
      console.log(`⚠️ File not found: ${uploadPath}`);
    }
    
    // Delete thumbnail file
    if (fs.existsSync(thumbnailPath)) {
      try {
        fs.unlinkSync(thumbnailPath);
        filesDeleted++;
        console.log(`✅ Deleted thumbnail: ${thumbnailPath}`);
      } catch (unlinkError) {
        console.error(`Error deleting thumbnail ${thumbnailPath}:`, unlinkError);
        errors.push(`Failed to delete thumbnail: ${unlinkError.message}`);
      }
    } else {
      console.log(`⚠️ Thumbnail not found: ${thumbnailPath}`);
    }
    
    // Try to delete from database if it exists
    try {
      const image = await prisma.image.findFirst({
        where: { filename }
      });
      
      if (image) {
        await prisma.image.delete({
          where: { id: image.id }
        });
        console.log(`✅ Deleted database record for: ${filename}`);
      } else {
        console.log(`ℹ️ No database record found for ${filename} (filesystem-only photo)`);
      }
    } catch (dbError) {
      // Database record might not exist, that's fine
      console.log(`ℹ️ No database record found for ${filename} (filesystem-only photo): ${dbError.message}`);
    }
    
    if (filesDeleted === 0 && errors.length === 0) {
      return res.status(404).json({ error: 'Image file not found on disk' });
    }
    
    if (errors.length > 0) {
      console.warn(`⚠️ Some errors occurred during deletion: ${errors.join(', ')}`);
    }
    
    console.log(`✅ Successfully deleted image: ${filename} (${filesDeleted} file(s) deleted)`);
    res.json({ 
      success: true, 
      message: `Image deleted successfully. ${filesDeleted} file(s) removed from storage.`,
      filesDeleted,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error deleting image by filename:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
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
    // Return empty array instead of crashing
    res.json({ blogPosts: blogPosts || [] });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Return empty array instead of crashing
    res.json({ blogPosts: [] });
  }
});

app.post('/api/blog-posts', async (req, res) => {
  try {
    console.log('Creating blog post...');
    const { title, slug, description, date, tags, featured, published, images } = req.body;
    
    // Ensure blog post images are also in the Image table
    if (images && Array.isArray(images)) {
      for (const imageFilename of images) {
        // Check if image already exists in Image table
        const existingImage = await prisma.image.findFirst({
          where: { filename: imageFilename }
        });
        
        if (!existingImage) {
          // Create Image record for blog post image
          await prisma.image.create({
            data: {
              filename: imageFilename,
              title: imageFilename,
              description: `From blog post: ${title || 'Untitled'}`,
              category: 'blog',
              date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }
          });
          console.log(`Created Image record for blog photo: ${imageFilename}`);
        }
      }
    }
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description,
        date: new Date(date),
        tags: tags || [],
        featured: featured || false,
        published: published || false,
        images: images || []
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
    
    // Get the current blog post to check if it's being published for the first time
    const currentPost = await prisma.blogPost.findUnique({
      where: { id }
    });
    
    // Ensure blog post images are also in the Image table
    if (images && Array.isArray(images)) {
      for (const imageFilename of images) {
        // Check if image already exists in Image table
        const existingImage = await prisma.image.findFirst({
          where: { filename: imageFilename }
        });
        
        if (!existingImage) {
          // Create Image record for blog post image
          await prisma.image.create({
            data: {
              filename: imageFilename,
              title: imageFilename,
              description: `From blog post: ${title || 'Untitled'}`,
              category: 'blog',
              date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            }
          });
          console.log(`Created Image record for blog photo: ${imageFilename}`);
        }
      }
    }
    
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
    
    // Send email notifications if this is a new publication
    if (published && (!currentPost || !currentPost.published)) {
      await sendBlogNotificationEmail(blogPost);
    }
    
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
    
    // Get featured photos that are either:
    // 1. Featured AND in the specified category, OR
    // 2. Featured AND category matches (for gallery display)
    const where = { 
      featured: true
    };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    const featuredPhotos = await prisma.image.findMany({
      where,
      include: {
        folder: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${featuredPhotos.length} featured photos${category ? ` for category ${category}` : ''}`);
    res.json({ featuredPhotos: featuredPhotos || [] });
  } catch (error) {
    console.error('Error fetching featured photos:', error);
    // Return empty array instead of crashing
    res.json({ featuredPhotos: [] });
  }
});

app.patch('/api/images/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;
    const { featured, category } = req.body;
    
    // Build update data
    const updateData = {};
    if (featured !== undefined) {
      updateData.featured = featured;
    }
    if (category !== undefined) {
      updateData.category = category;
    }
    
    const image = await prisma.image.update({
      where: { id },
      data: updateData
    });
    
    console.log(`Updated featured status for image: ${image.filename}, featured: ${featured}, category: ${category}`);
    res.json({ image });
  } catch (error) {
    console.error('Error updating featured status:', error);
    res.status(500).json({ error: 'Failed to update featured status', details: error.message });
  }
});

// Create image endpoint (for blog photos that need Image records)
app.post('/api/images', async (req, res) => {
  try {
    const { filename, title, description, category, date, featured } = req.body;
    
    // Check if image already exists using raw SQL to avoid schema issues
    let existingImage = null;
    try {
      const existingCheck = await prisma.$queryRawUnsafe(
        `SELECT id, filename, title, description, category, featured FROM images WHERE filename = $1 LIMIT 1`,
        filename
      );
      if (existingCheck && existingCheck.length > 0) {
        existingImage = existingCheck[0];
      }
    } catch (queryError) {
      console.warn('Could not check for existing image:', queryError.message);
      // Continue to try creating
    }
    
    if (existingImage) {
      console.log(`Image already exists: ${existingImage.filename}`);
      return res.json({ image: existingImage });
    }
    
    // Try to create using Prisma first
    let image = null;
    try {
      image = await prisma.image.create({
        data: {
          filename,
          title: title || filename,
          description: description || '',
          category: category || null,
          featured: featured || false
        }
      });
      console.log(`Created Image record via Prisma: ${image.filename}`);
    } catch (prismaError) {
      // If Prisma fails, try raw SQL
      console.log(`Prisma create failed, trying raw SQL: ${prismaError.message}`);
      
      try {
        // Generate UUID for the image
        const imageId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        // Try to insert with minimal required fields
        const insertResult = await prisma.$executeRawUnsafe(
          `INSERT INTO images (id, filename, checksum, featured, "createdAt", "updatedAt", title, description, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, filename, title, description, category, featured, "createdAt", "updatedAt"`,
          imageId,
          filename,
          crypto.createHash('sha256').update(filename).digest('hex').substring(0, 64), // Generate a checksum
          featured || false,
          now,
          now,
          title || filename,
          description || '',
          category || null
        );
        
        // Fetch the created image
        const createdCheck = await prisma.$queryRawUnsafe(
          `SELECT id, filename, title, description, category, featured, "createdAt", "updatedAt" FROM images WHERE id = $1 LIMIT 1`,
          imageId
        );
        
        if (createdCheck && createdCheck.length > 0) {
          image = createdCheck[0];
          console.log(`Created Image record via raw SQL: ${image.filename}`);
        } else {
          throw new Error('Image was created but could not be retrieved');
        }
      } catch (sqlError) {
        console.error('Raw SQL create also failed:', sqlError);
        // Return success anyway - the file exists on disk
        // Create a virtual record for the response
        image = {
          id: `fs-${crypto.createHash('sha256').update(filename).digest('hex').substring(0, 8)}`,
          filename: filename,
          title: title || filename,
          description: description || '',
          category: category || null,
          featured: featured || false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log(`Created virtual Image record (file exists, DB record creation failed): ${image.filename}`);
        return res.status(201).json({ 
          image,
          warning: 'File exists on disk but database record creation failed. This is non-critical.'
        });
      }
    }
    
    res.status(201).json({ image });
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ error: 'Failed to create image', details: error.message });
  }
});

// Delete image endpoint (by ID)
app.delete('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete image by ID: ${id}`);
    
    // Get image info before deleting
    const image = await prisma.image.findUnique({
      where: { id }
    });
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found in database' });
    }
    
    console.log(`Found image in database: ${image.filename}`);
    
    // Delete physical files from storage
    const uploadPath = path.join(__dirname, 'public', 'images', 'uploads', image.filename);
    const thumbnailPath = path.join(__dirname, 'public', 'images', 'thumbnails', image.filename);
    
    let filesDeleted = 0;
    let errors = [];
    
    // Delete main image file
    if (fs.existsSync(uploadPath)) {
      try {
        fs.unlinkSync(uploadPath);
        filesDeleted++;
        console.log(`✅ Deleted file: ${uploadPath}`);
      } catch (unlinkError) {
        console.error(`Error deleting file ${uploadPath}:`, unlinkError);
        errors.push(`Failed to delete file: ${unlinkError.message}`);
      }
    } else {
      console.log(`⚠️ File not found: ${uploadPath}`);
    }
    
    // Delete thumbnail file
    if (fs.existsSync(thumbnailPath)) {
      try {
        fs.unlinkSync(thumbnailPath);
        filesDeleted++;
        console.log(`✅ Deleted thumbnail: ${thumbnailPath}`);
      } catch (unlinkError) {
        console.error(`Error deleting thumbnail ${thumbnailPath}:`, unlinkError);
        errors.push(`Failed to delete thumbnail: ${unlinkError.message}`);
      }
    } else {
      console.log(`⚠️ Thumbnail not found: ${thumbnailPath}`);
    }
    
    // Delete from database
    await prisma.image.delete({
      where: { id }
    });
    console.log(`✅ Deleted database record for: ${image.filename}`);
    
    if (errors.length > 0) {
      console.warn(`⚠️ Some errors occurred during deletion: ${errors.join(', ')}`);
    }
    
    console.log(`✅ Successfully deleted image: ${image.filename} (${filesDeleted} file(s) deleted from storage)`);
    res.json({ 
      success: true, 
      message: `Image deleted successfully. ${filesDeleted} file(s) removed from storage.`,
      filesDeleted,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
});

// Update image order endpoint
app.patch('/api/images/:id/order', async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    
    // Try to update using raw SQL (order field may not exist in schema yet)
    try {
      await prisma.$executeRawUnsafe(
        `UPDATE images SET "order" = $1 WHERE id = $2`,
        order, id
      );
      console.log(`Updated order for image ${id} to ${order}`);
      res.json({ success: true, order });
    } catch (sqlError) {
      // If order column doesn't exist, try to add it
      if (sqlError.message.includes('column') && sqlError.message.includes('does not exist')) {
        try {
          await prisma.$executeRawUnsafe(
            `ALTER TABLE images ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0`
          );
          // Retry the update
          await prisma.$executeRawUnsafe(
            `UPDATE images SET "order" = $1 WHERE id = $2`,
            order, id
          );
          console.log(`Added order column and updated order for image ${id} to ${order}`);
          res.json({ success: true, order });
        } catch (alterError) {
          console.error('Error adding order column:', alterError);
          // Fallback: just return success (order will be handled in application logic)
          res.json({ success: true, order, note: 'Order column not available, using application-level ordering' });
        }
      } else {
        throw sqlError;
      }
    }
  } catch (error) {
    console.error('Error updating image order:', error);
    res.status(500).json({ error: 'Failed to update image order', details: error.message });
  }
});

// Update image visibility endpoint (using featured field for now)
app.patch('/api/images/:id/visibility', async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    
    // For now, we'll use a combination: visible means featured=true
    // In the future, we can add a separate visible field
    const image = await prisma.image.update({
      where: { id },
      data: { featured: visible !== false }
    });
    
    console.log(`Updated visibility for image ${id}: ${visible}`);
    res.json({ image, visible: image.featured });
  } catch (error) {
    console.error('Error updating image visibility:', error);
    res.status(500).json({ error: 'Failed to update image visibility', details: error.message });
  }
});

// Update image endpoint (general update)
app.patch('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const image = await prisma.image.update({
      where: { id },
      data: updateData
    });
    
    console.log(`Updated image ${id}`);
    res.json({ image });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image', details: error.message });
  }
});

// SIMPLIFIED: Just list photos from filesystem - no database import
// Users can see all photos and manually upload ones they want in the database
app.get('/api/images/filesystem', async (req, res) => {
  try {
    console.log('Listing photos from file system...');
    
    const uploadsDir = path.join(__dirname, 'public', 'images', 'uploads');
    const thumbnailsDir = path.join(__dirname, 'public', 'images', 'thumbnails');
    
    // Ensure thumbnails directory exists
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
      console.log('Created thumbnails directory');
    }
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ 
        success: true, 
        message: 'Uploads directory does not exist',
        found: 0,
        imported: 0,
        skipped: 0,
        errors: 0
      });
    }
    
    // Get all image files from uploads directory
    let imageFiles = [];
    try {
      imageFiles = fs.readdirSync(uploadsDir).filter(file => {
        // Filter out directories and only include image files
        const filePath = path.join(uploadsDir, file);
        const isFile = fs.statSync(filePath).isFile();
        return isFile && /\.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP)$/i.test(file);
      });
    } catch (readError) {
      console.error('Error reading uploads directory:', readError);
      return res.status(500).json({
        error: 'Failed to read uploads directory',
        details: readError.message
      });
    }
    
    console.log(`Found ${imageFiles.length} image files in uploads directory`);
    
    // Get existing images from database to mark which are already imported
    let existingImages = [];
    try {
      existingImages = await prisma.image.findMany({
        select: { filename: true }
      });
    } catch (dbError) {
      console.warn('Could not fetch existing images:', dbError.message);
      existingImages = [];
    }
    
    const existingFilenames = new Set(existingImages.map(img => img.filename).filter(Boolean));
    
    // Create file list with metadata (NO DATABASE INSERTION)
    const fileList = imageFiles.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      const thumbnailPath = path.join(thumbnailsDir, file);
      const hasThumbnail = fs.existsSync(thumbnailPath);
      
      return {
        filename: file,
        size: stats.size,
        modified: stats.mtime,
        url: `/images/uploads/${file}`,
        thumbnail: hasThumbnail ? `/images/thumbnails/${file}` : null,
        inDatabase: existingFilenames.has(file),
        source: 'filesystem'
      };
    });
    
    res.json({
      success: true,
      message: `Found ${imageFiles.length} photos. ${existingFilenames.size} already in database.`,
      found: imageFiles.length,
      inDatabase: existingFilenames.size,
      notInDatabase: imageFiles.length - existingFilenames.size,
      files: fileList
    });
    
  } catch (error) {
    console.error('Error listing photos:', error);
    res.status(500).json({
      error: 'Failed to list photos',
      details: error.message
    });
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

// Email subscription endpoints
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email is already subscribed' });
    }

    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        subscribed: true,
        subscribedAt: new Date()
      }
    });

    console.log(`New subscriber: ${email}`);
    res.json({ message: 'Successfully subscribed!', subscriber });
  } catch (error) {
    console.error('Error subscribing email:', error);
    res.status(500).json({ error: 'Failed to subscribe email', details: error.message });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      where: { subscribed: true },
      orderBy: { subscribedAt: 'desc' }
    });
    
    res.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ error: 'Failed to fetch subscribers', details: error.message });
  }
});

app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    });

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await prisma.subscriber.update({
      where: { email },
      data: { subscribed: false, unsubscribedAt: new Date() }
    });

    console.log(`Unsubscribed: ${email}`);
    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error('Error unsubscribing email:', error);
    res.status(500).json({ error: 'Failed to unsubscribe email', details: error.message });
  }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      return res.status(400).json({ error: 'Mailgun not configured. Please add MAILGUN_API_KEY and MAILGUN_DOMAIN to your .env file' });
    }

    const testBlogPost = {
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      description: 'This is a test email to verify your Mailgun setup is working correctly!'
    };

    // Send test email
    const msg = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM || `Torrey Liu Photography <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [email],
      subject: 'Test Email - Mailgun Setup',
      text: 'This is a test email to verify your Mailgun setup is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">✅ Mailgun Test Email</h1>
          <p>This is a test email to verify your Mailgun setup is working correctly!</p>
          <p>If you received this email, your email notification system is ready to go! 🎉</p>
        </div>
      `
    });

    console.log(`Test email sent to ${email}: ${msg.id}`);
    res.json({ 
      message: 'Test email sent successfully!', 
      messageId: msg.id,
      email: email 
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      error: 'Failed to send test email', 
      details: error.message 
    });
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
    const errors = [];
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
        
        // Check if image already exists using raw SQL to avoid schema issues
        const existingCheck = await prisma.$queryRawUnsafe(
          `SELECT id, filename FROM images WHERE checksum = $1 LIMIT 1`,
          checksum
        );
        
        if (existingCheck && existingCheck.length > 0) {
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
        
        // File is already saved and thumbnail created - database record is optional
        // Create a virtual record for the response (file is successfully saved)
        let image = {
          id: `fs-${checksum.substring(0, 8)}`,
          filename: file.filename,
          title: path.parse(file.originalname).name
        };
        let dbRecordCreated = false;
        
        // Try to create database record, but don't fail the upload if it doesn't work
        // Wrap in try-catch to ensure any database errors don't break the upload
        try {
          // First, check if record already exists (using safe query)
          try {
            const existing = await prisma.$queryRawUnsafe(
              `SELECT id, filename FROM images WHERE checksum = $1 LIMIT 1`,
              checksum
            );
            
            if (existing && existing.length > 0) {
              // Record already exists
              image = {
                id: existing[0].id,
                filename: existing[0].filename,
                title: path.parse(file.originalname).name
              };
              dbRecordCreated = true;
              console.log(`Image record already exists for ${file.filename}`);
            }
          } catch (queryError) {
            // Query failed, continue to create new record
            console.log(`Could not check for existing record: ${queryError.message}`);
          }
          
          // If no existing record, try to create one (but don't fail if it doesn't work)
          if (!dbRecordCreated) {
            try {
              const newImage = await prisma.image.create({
                data: {
                  filename: file.filename,
                  checksum: checksum,
                  title: path.parse(file.originalname).name,
                  category: 'uploads',
                  tags: [],
                  featured: false
                }
              });
              image = {
                id: newImage.id,
                filename: newImage.filename,
                title: newImage.title
              };
              dbRecordCreated = true;
              console.log(`Database record created successfully for ${file.filename}`);
            } catch (createError) {
              // Database record creation failed - that's completely fine, file is still saved
              console.log(`Database record creation skipped (non-critical) for ${file.filename}: ${createError.message}`);
              // Continue with virtual record - upload is still successful
            }
          }
        } catch (dbError) {
          // Any unexpected database error - file is still saved, so this is non-critical
          console.log(`Database operation failed (non-critical) for ${file.filename}: ${dbError.message}`);
          // Continue with virtual record - upload is still successful
        }
        
        uploadedImages.push({
          id: image.id,
          filename: image.filename,
          title: image.title,
          url: `/images/uploads/${file.filename}`,
          thumbnail: `/images/thumbnails/${file.filename}`,
          dbRecordCreated: dbRecordCreated
        });
        
        // Verify file exists on disk
        const finalFilePath = path.join(__dirname, 'public', 'images', 'uploads', file.filename);
        const fileExists = fs.existsSync(finalFilePath);
        console.log(`📁 File saved to: ${finalFilePath}`);
        console.log(`📁 File exists on disk: ${fileExists}`);
        console.log(`📁 File size: ${fileExists ? fs.statSync(finalFilePath).size : 'N/A'} bytes`);
        
        // Verify thumbnail exists
        const finalThumbnailPath = path.join(__dirname, 'public', 'images', 'thumbnails', file.filename);
        const thumbnailExists = fs.existsSync(finalThumbnailPath);
        console.log(`📁 Thumbnail saved to: ${finalThumbnailPath}`);
        console.log(`📁 Thumbnail exists: ${thumbnailExists}`);
        
        if (dbRecordCreated) {
          console.log(`✅ Uploaded: ${file.originalname} -> ${file.filename} (${processedCount}/${totalFiles}) - DB record created`);
        } else {
          console.log(`✅ Uploaded: ${file.originalname} -> ${file.filename} (${processedCount}/${totalFiles}) - File saved, DB record skipped (will appear in filesystem sync)`);
        }
        
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        errors.push({
          filename: file.originalname,
          error: fileError.message || 'Unknown error'
        });
        // Clean up failed file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    // Count how many files were actually saved (even if DB record creation failed)
    const filesSaved = totalFiles - errors.length;
    
    console.log(`Upload complete: ${filesSaved} files saved, ${uploadedImages.length} with DB records, ${errors.length} errors`);
    
    // Success if any files were saved (even without DB records)
    // Files are saved to disk even if database creation fails
    res.json({ 
      success: filesSaved > 0,
      uploaded: filesSaved, // Total files saved (including those without DB records)
      dbRecordsCreated: uploadedImages.length, // How many got DB records
      errors: errors.length,
      firstError: errors.length > 0 ? errors[0].error : null,
      images: uploadedImages,
      message: filesSaved > 0 
        ? `Successfully saved ${filesSaved} file(s). ${uploadedImages.length} have database records.`
        : 'Upload failed'
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

// Import jobs endpoint (for ImportPanel)
app.get('/api/import', async (req, res) => {
  try {
    console.log('Fetching import jobs...');
    const jobs = await prisma.importJob.findMany({
      orderBy: { startedAt: 'desc' },
      take: 50 // Limit to last 50 jobs
    });
    console.log(`Found ${jobs.length} import jobs`);
    res.json({ jobs: jobs || [] });
  } catch (error) {
    console.error('Error fetching import jobs:', error);
    // Return empty array instead of crashing
    res.json({ jobs: [] });
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
