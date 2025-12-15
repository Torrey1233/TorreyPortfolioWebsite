import fetch from 'node-fetch';

async function manualExportBlogs() {
  try {
    console.log('Fetching blog posts from API...');
    
    const response = await fetch('http://localhost:3001/api/blog-posts');
    const data = await response.json();
    
    if (data.blogPosts && data.blogPosts.length > 0) {
      console.log(`Found ${data.blogPosts.length} blog posts`);
      
      // Convert to static format
      const staticBlogPosts = {};
      
      data.blogPosts.forEach(post => {
        if (post.published) {
          const staticPost = {
            id: post.slug,
            title: post.title,
            description: post.description,
            date: post.date.split('T')[0], // Format as YYYY-MM-DD
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
          console.log(`Exported: ${post.title}`);
        }
      });

      // Create the export content
      const exportContent = `// Auto-generated static blog posts export
// Generated on: ${new Date().toISOString()}
// Total posts: ${Object.keys(staticBlogPosts).length}

export const blogPosts = ${JSON.stringify(staticBlogPosts, null, 2)};

// Note: This file is auto-generated. To add new blog posts:
// 1. Use the admin panel in development mode
// 2. Run: node manual-export-blogs.js
// 3. Commit the updated file
`;

      // Write to file
      const fs = await import('fs');
      fs.writeFileSync('./src/data/static-blog-posts.js', exportContent);
      
      console.log(`✅ Exported ${Object.keys(staticBlogPosts).length} blog posts to ./src/data/static-blog-posts.js`);
      console.log('📝 Next steps:');
      console.log('1. Run: npm run build');
      console.log('2. Deploy the dist folder');
      
    } else {
      console.log('No blog posts found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Make sure the API server is running: npm run api');
  }
}

manualExportBlogs();

