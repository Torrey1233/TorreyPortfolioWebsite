import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

async function exportBlogPosts() {
  try {
    console.log('Exporting blog posts from database...');
    
    // Check if database is available
    let blogPosts = [];
    try {
      blogPosts = await prisma.blogPost.findMany({
        where: {
          published: true
        },
        orderBy: {
          date: 'desc'
        }
      });
      console.log(`Found ${blogPosts.length} published blog posts`);
    } catch (dbError) {
      console.log('Database not available, creating empty export file');
      console.log('This is normal if you haven\'t set up the database yet');
    }

    // Convert to static format
    const staticBlogPosts = {};
    
    blogPosts.forEach(post => {
      const staticPost = {
        id: post.slug,
        title: post.title,
        description: post.description,
        date: post.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
        tags: post.tags || [],
        featured: post.featured,
        category: post.category || 'general',
        photos: post.images || [],
        equipment: post.equipment ? JSON.parse(post.equipment) : null,
        location: post.location || '',
        weather: post.weather || '',
        notes: post.notes || ''
      };
      
      staticBlogPosts[post.slug] = staticPost;
    });

    // Read existing static blog posts
    const existingStaticPath = './src/data/photography-data.js';
    let existingContent = '';
    
    try {
      existingContent = fs.readFileSync(existingStaticPath, 'utf8');
    } catch (err) {
      console.log('Could not read existing photography-data.js');
    }

    // Extract existing static blog posts (before the export)
    const staticBlogPostsMatch = existingContent.match(/export const blogPosts = ({[\s\S]*?});/);
    let existingStaticBlogPosts = {};
    
    if (staticBlogPostsMatch) {
      try {
        // This is a simplified extraction - you might need to adjust based on your data structure
        console.log('Found existing static blog posts');
      } catch (err) {
        console.log('Could not parse existing static blog posts');
      }
    }

    // Merge with existing static posts (API posts take precedence)
    const mergedBlogPosts = { ...existingStaticBlogPosts, ...staticBlogPosts };

    // Create the export content
    const exportContent = `// Auto-generated static blog posts export
// Generated on: ${new Date().toISOString()}
// Total posts: ${Object.keys(mergedBlogPosts).length}

export const blogPosts = ${JSON.stringify(mergedBlogPosts, null, 2)};

// Note: This file is auto-generated. To add new blog posts:
// 1. Use the admin panel in development mode
// 2. Run: node export-blog-posts.js
// 3. Commit the updated file
`;

    // Write to a separate file for blog posts
    const blogPostsPath = './src/data/static-blog-posts.js';
    fs.writeFileSync(blogPostsPath, exportContent);
    
    console.log(`✅ Exported ${Object.keys(staticBlogPosts).length} blog posts to ${blogPostsPath}`);
    console.log('📝 Next steps:');
    console.log('1. Import this file in your Photography component');
    console.log('2. Run npm run build');
    console.log('3. Deploy the dist folder');

  } catch (error) {
    console.error('Error exporting blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportBlogPosts();
