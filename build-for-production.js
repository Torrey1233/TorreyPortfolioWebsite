import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building portfolio for production...\n');

try {
  // Step 1: Export blog posts from database
  console.log('📝 Step 1: Exporting blog posts from database...');
  try {
    execSync('node export-blog-posts.js', { stdio: 'inherit' });
    console.log('✅ Blog posts exported successfully\n');
  } catch (err) {
    console.log('⚠️  Could not export blog posts (database might not be available)');
    console.log('   Continuing with static blog posts only...\n');
  }

  // Step 2: Build the application
  console.log('🔨 Step 2: Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');

  // Step 3: Check if dist folder exists
  const distPath = './dist';
  if (fs.existsSync(distPath)) {
    console.log('📁 Step 3: Build output ready');
    console.log(`   📂 Dist folder: ${path.resolve(distPath)}`);
    console.log(`   📊 Size: ${getFolderSize(distPath)}`);
    console.log('\n🎉 Production build ready!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy the entire "dist" folder to your web server');
    console.log('2. Make sure all files in "dist" are served as static files');
    console.log('3. Your blog posts should now be included in the build');
  } else {
    console.log('❌ Build failed - dist folder not found');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function getFolderSize(folderPath) {
  let totalSize = 0;
  
  function calculateSize(itemPath) {
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      totalSize += stats.size;
    }
  }
  
  calculateSize(folderPath);
  
  // Convert to human readable format
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = totalSize;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
