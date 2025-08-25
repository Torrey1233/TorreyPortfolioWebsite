#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script helps optimize images for web performance
 * Run with: node optimize-images.js
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
 * Gets file size in MB
 */
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

/**
 * Analyzes image sizes in a directory
 */
function analyzeImageSizes(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath).filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  return files.map(file => {
    const filePath = path.join(dirPath, file);
    const sizeMB = getFileSizeMB(filePath);
    return { file, sizeMB, path: filePath };
  });
}

/**
 * Main function to analyze all images
 */
function main() {
  console.log('🔍 Analyzing image sizes...\n');

  let totalSize = 0;
  let largeImages = [];

  // Analyze blog folders
  console.log('📁 Blog Folders:');
  Object.entries(BLOG_FOLDERS).forEach(([blogId, folderPath]) => {
    const images = analyzeImageSizes(folderPath);
    const folderSize = images.reduce((sum, img) => sum + parseFloat(img.sizeMB), 0);
    totalSize += folderSize;
    
    console.log(`  ${blogId}: ${images.length} photos (${folderSize.toFixed(2)} MB)`);
    
    // Find large images (>500KB)
    const large = images.filter(img => parseFloat(img.sizeMB) > 0.5);
    largeImages.push(...large);
  });

  // Analyze processed folders
  console.log('\n📁 Processed Folders:');
  Object.entries(PROCESSED_FOLDERS).forEach(([category, folderPath]) => {
    const images = analyzeImageSizes(folderPath);
    const folderSize = images.reduce((sum, img) => sum + parseFloat(img.sizeMB), 0);
    totalSize += folderSize;
    
    console.log(`  ${category}: ${images.length} photos (${folderSize.toFixed(2)} MB)`);
    
    // Find large images (>500KB)
    const large = images.filter(img => parseFloat(img.sizeMB) > 0.5);
    largeImages.push(...large);
  });

  console.log(`\n📊 Total Size: ${totalSize.toFixed(2)} MB`);
  console.log(`⚠️  Large Images (>500KB): ${largeImages.length}`);

  if (largeImages.length > 0) {
    console.log('\n🔴 Large Images (consider optimizing):');
    largeImages
      .sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB))
      .slice(0, 10)
      .forEach(img => {
        console.log(`  ${img.file}: ${img.sizeMB} MB`);
      });
  }

  console.log('\n💡 Optimization Recommendations:');
  console.log('1. Resize images to max 1920px width for web');
  console.log('2. Use WebP format for better compression');
  console.log('3. Compress JPEG quality to 80-85%');
  console.log('4. Create thumbnails for gallery display');
  console.log('5. Use lazy loading in the React app');
  console.log('6. Implement progressive image loading');

  console.log('\n🛠️  Quick fixes you can implement:');
  console.log('- Add lazy loading to image components');
  console.log('- Use smaller thumbnails in gallery');
  console.log('- Implement progressive loading');
  console.log('- Add loading="lazy" to img tags');
}

// Run the script
main();
