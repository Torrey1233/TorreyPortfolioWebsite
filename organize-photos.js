#!/usr/bin/env node

/**
 * Photo Organization Script
 * 
 * This script helps automatically organize photos and generate metadata
 * Run with: node organize-photos.js
 */

import fs from 'fs';
import path from 'path';

// Configuration
const BLOG_FOLDERS = {
  'aurora-june-2-2025': 'public/images/blog-posts/aurora-june-2-2025',
  'stargazing-denholm-july-25-2025': 'public/images/blog-posts/stargazing-denholm-july-25-2025',
  'pomelo-soda-aug-9-2025': 'public/images/blog-posts/pomelo-soda-aug-9-2025'
};

const PROCESSED_FOLDERS = {
  'street': 'public/images/processed/street',
  'automotive': 'public/images/processed/automotive',
  'astro': 'public/images/processed/astro',
  'concerts': 'public/images/processed/concerts'
};

/**
 * Scans a directory for image files
 */
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return [];
  }

  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message);
    return [];
  }
}

/**
 * Generates metadata for a photo based on context
 */
function generatePhotoMetadata(filename, blogPostId) {
  const baseMetadata = {
    title: `Photo from ${blogPostId}`,
    category: 'astro',
    date: new Date().toISOString().split('T')[0],
    location: 'Unknown Location',
    description: `Photo from ${blogPostId} blog post`,
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '35mm'
    },
    tags: ['blog', blogPostId],
    featured: false,
    blogPost: blogPostId
  };

  // Customize based on blog post
  switch (blogPostId) {
    case 'aurora-june-2-2025':
      baseMetadata.title = `Aurora Photo ${filename.split('-')[1]?.split('.')[0] || 'Unknown'}`;
      baseMetadata.category = 'astro';
      baseMetadata.location = 'Northern Canada';
      baseMetadata.description = 'Aurora borealis photography';
      baseMetadata.lens = 'TTartisan 10mm F2.0';
      baseMetadata.settings = {
        shutterSpeed: '20s',
        aperture: 'f/2.0',
        iso: '3200',
        focalLength: '10mm'
      };
      baseMetadata.tags = ['aurora', 'northern-lights', 'night-sky'];
      break;
      
    case 'stargazing-denholm-july-25-2025':
      baseMetadata.title = `Stargazing Photo ${filename.split('-')[1]?.split('.')[0] || 'Unknown'}`;
      baseMetadata.category = 'astro';
      baseMetadata.location = 'Denholm, Scotland';
      baseMetadata.description = 'Stargazing and night sky photography';
      baseMetadata.lens = 'TTartisan 10mm F2.0';
      baseMetadata.settings = {
        shutterSpeed: '30s',
        aperture: 'f/2.0',
        iso: '3200',
        focalLength: '10mm'
      };
      baseMetadata.tags = ['stargazing', 'night-sky', 'stars'];
      break;
      
    case 'pomelo-soda-aug-9-2025':
      baseMetadata.title = `Concert Photo ${filename.split('-')[1]?.split('.')[0] || 'Unknown'}`;
      baseMetadata.category = 'concerts';
      baseMetadata.location = 'Live Music Venue';
      baseMetadata.description = 'Live concert photography';
      baseMetadata.settings = {
        shutterSpeed: '1/100s',
        aperture: 'f/3.5',
        iso: '1600',
        focalLength: '50mm'
      };
      baseMetadata.tags = ['concerts', 'live-music', 'performance'];
      break;
  }

  return baseMetadata;
}

/**
 * Generates metadata for processed photos
 */
function generateProcessedPhotoMetadata(filename, category) {
  const baseMetadata = {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Photo`,
    category: category,
    date: new Date().toISOString().split('T')[0],
    location: 'Various Locations',
    description: `${category} photography`,
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '35mm'
    },
    tags: [category],
    featured: false
  };

  // Customize based on category
  switch (category) {
    case 'astro':
      baseMetadata.lens = 'TTartisan 10mm F2.0';
      baseMetadata.settings = {
        shutterSpeed: '30s',
        aperture: 'f/2.0',
        iso: '3200',
        focalLength: '10mm'
      };
      baseMetadata.tags = ['astro', 'night-sky', 'stars'];
      break;
      
    case 'concerts':
      baseMetadata.settings = {
        shutterSpeed: '1/100s',
        aperture: 'f/3.5',
        iso: '1600',
        focalLength: '50mm'
      };
      baseMetadata.tags = ['concerts', 'live-music', 'performance'];
      break;
  }

  return baseMetadata;
}

/**
 * Main function to scan and generate metadata
 */
function main() {
  console.log('🔍 Scanning photo directories...\n');

  // Scan blog folders
  console.log('📁 Blog Folders:');
  const blogPhotos = {};
  
  Object.entries(BLOG_FOLDERS).forEach(([blogId, folderPath]) => {
    const photos = scanDirectory(folderPath);
    blogPhotos[blogId] = photos;
    console.log(`  ${blogId}: ${photos.length} photos`);
  });

  // Scan processed folders
  console.log('\n📁 Processed Folders:');
  const processedPhotos = {};
  
  Object.entries(PROCESSED_FOLDERS).forEach(([category, folderPath]) => {
    const photos = scanDirectory(folderPath);
    processedPhotos[category] = photos;
    console.log(`  ${category}: ${photos.length} photos`);
  });

  // Generate metadata for blog photos
  console.log('\n📝 Generating blog photo metadata...');
  let blogMetadataScript = '// Auto-generated blog photo metadata\n';
  blogMetadataScript += '// Add this to the photoMetadata object:\n\n';

  Object.entries(blogPhotos).forEach(([blogId, photos]) => {
    photos.forEach(filename => {
      const metadata = generatePhotoMetadata(filename, blogId);
      blogMetadataScript += `  '${filename}': {\n`;
      blogMetadataScript += `    title: '${metadata.title}',\n`;
      blogMetadataScript += `    category: '${metadata.category}',\n`;
      blogMetadataScript += `    date: '${metadata.date}',\n`;
      blogMetadataScript += `    location: '${metadata.location}',\n`;
      blogMetadataScript += `    description: '${metadata.description}',\n`;
      blogMetadataScript += `    camera: '${metadata.camera}',\n`;
      blogMetadataScript += `    lens: '${metadata.lens}',\n`;
      blogMetadataScript += `    settings: {\n`;
      blogMetadataScript += `      shutterSpeed: '${metadata.settings.shutterSpeed}',\n`;
      blogMetadataScript += `      aperture: '${metadata.settings.aperture}',\n`;
      blogMetadataScript += `      iso: '${metadata.settings.iso}',\n`;
      blogMetadataScript += `      focalLength: '${metadata.settings.focalLength}'\n`;
      blogMetadataScript += `    },\n`;
      blogMetadataScript += `    tags: ${JSON.stringify(metadata.tags)},\n`;
      blogMetadataScript += `    featured: ${metadata.featured},\n`;
      blogMetadataScript += `    blogPost: '${metadata.blogPost}'\n`;
      blogMetadataScript += `  },\n\n`;
    });
  });

  // Generate metadata for processed photos
  console.log('📝 Generating processed photo metadata...');
  let processedMetadataScript = '// Auto-generated processed photo metadata\n';
  processedMetadataScript += '// Add this to the photoMetadata object:\n\n';

  Object.entries(processedPhotos).forEach(([category, photos]) => {
    photos.forEach(filename => {
      const metadata = generateProcessedPhotoMetadata(filename, category);
      processedMetadataScript += `  '${filename}': {\n`;
      processedMetadataScript += `    title: '${metadata.title}',\n`;
      processedMetadataScript += `    category: '${metadata.category}',\n`;
      processedMetadataScript += `    date: '${metadata.date}',\n`;
      processedMetadataScript += `    location: '${metadata.location}',\n`;
      processedMetadataScript += `    description: '${metadata.description}',\n`;
      processedMetadataScript += `    camera: '${metadata.camera}',\n`;
      processedMetadataScript += `    lens: '${metadata.lens}',\n`;
      processedMetadataScript += `    settings: {\n`;
      processedMetadataScript += `      shutterSpeed: '${metadata.settings.shutterSpeed}',\n`;
      processedMetadataScript += `      aperture: '${metadata.settings.aperture}',\n`;
      processedMetadataScript += `      iso: '${metadata.settings.iso}',\n`;
      processedMetadataScript += `      focalLength: '${metadata.settings.focalLength}'\n`;
      processedMetadataScript += `    },\n`;
      processedMetadataScript += `    tags: ${JSON.stringify(metadata.tags)},\n`;
      processedMetadataScript += `    featured: ${metadata.featured}\n`;
      processedMetadataScript += `  },\n\n`;
    });
  });

  // Save scripts to files
  fs.writeFileSync('blog-photos-metadata.js', blogMetadataScript);
  fs.writeFileSync('processed-photos-metadata.js', processedMetadataScript);

  console.log('\n✅ Generated metadata files:');
  console.log('  - blog-photos-metadata.js');
  console.log('  - processed-photos-metadata.js');
  
  console.log('\n📋 Summary:');
  const totalBlogPhotos = Object.values(blogPhotos).flat().length;
  const totalProcessedPhotos = Object.values(processedPhotos).flat().length;
  console.log(`  Total blog photos: ${totalBlogPhotos}`);
  console.log(`  Total processed photos: ${totalProcessedPhotos}`);
  console.log(`  Total photos: ${totalBlogPhotos + totalProcessedPhotos}`);

  console.log('\n💡 Next steps:');
  console.log('  1. Review the generated metadata files');
  console.log('  2. Copy the metadata to src/data/photography-data.js');
  console.log('  3. Visit /photography/admin to validate the metadata');
  console.log('  4. Your website will automatically show the new photos!');
}

// Run the script
  main();
