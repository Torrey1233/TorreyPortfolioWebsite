// Script to import existing photos from your public/images directory
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();

// Helper function to generate checksum
function generateChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Helper function to create folder if it doesn't exist
async function ensureFolder(name, folderPath, parentId = null) {
  let folder = await prisma.folder.findFirst({
    where: { path: folderPath }
  });
  
  if (!folder) {
    folder = await prisma.folder.create({
      data: {
        name,
        path: folderPath,
        parentId
      }
    });
    console.log(`✅ Created folder: ${name} (${folderPath})`);
  }
  
  return folder;
}

// Helper function to create album if it doesn't exist
async function ensureAlbum(name, slug, description = '') {
  let album = await prisma.album.findFirst({
    where: { slug }
  });
  
  if (!album) {
    album = await prisma.album.create({
      data: {
        name,
        slug,
        description
      }
    });
    console.log(`✅ Created album: ${name}`);
  }
  
  return album;
}

// Main import function
async function importExistingPhotos() {
  console.log('🚀 Starting import of existing photos...\n');
  
  try {
    // Create root folders
    const processedFolder = await ensureFolder('Processed Photos', '/photos/processed');
    const blogPostsFolder = await ensureFolder('Blog Posts', '/photos/blog-posts');
    
    // Create category folders
    const astroFolder = await ensureFolder('Astro Photography', '/photos/processed/astro', processedFolder.id);
    const automotiveFolder = await ensureFolder('Automotive Photography', '/photos/processed/automotive', processedFolder.id);
    const concertsFolder = await ensureFolder('Concert Photography', '/photos/processed/concerts', processedFolder.id);
    const streetFolder = await ensureFolder('Street Photography', '/photos/processed/street', processedFolder.id);
    
    // Create blog post folders
    const auroraFolder = await ensureFolder('Aurora June 2025', '/photos/blog-posts/aurora-june-2-2025', blogPostsFolder.id);
    const pomeloFolder = await ensureFolder('Pomelo Soda Concert', '/photos/blog-posts/pomelo-soda-aug-9-2025', blogPostsFolder.id);
    const stargazingFolder = await ensureFolder('Stargazing Denholm', '/photos/blog-posts/stargazing-denholm-july-25-2025', blogPostsFolder.id);
    
    // Create albums
    const astroAlbum = await ensureAlbum('Astro Photography', 'astro-photography', 'Astrophotography collection');
    const automotiveAlbum = await ensureAlbum('Automotive Photography', 'automotive-photography', 'Car and automotive photography');
    const concertsAlbum = await ensureAlbum('Concert Photography', 'concert-photography', 'Live music and concert photography');
    const streetAlbum = await ensureAlbum('Street Photography', 'street-photography', 'Street and urban photography');
    const auroraAlbum = await ensureAlbum('Aurora June 2025', 'aurora-june-2025', 'Aurora photography from June 2, 2025');
    const pomeloAlbum = await ensureAlbum('Pomelo Soda Concert', 'pomelo-soda-concert', 'Pomelo Soda concert from August 9, 2025');
    const stargazingAlbum = await ensureAlbum('Stargazing Denholm', 'stargazing-denholm', 'Stargazing session in Denholm, July 25, 2025');
    
    // Import processed photos
    const processedPaths = [
      { folder: astroFolder, album: astroAlbum, path: 'public/images/processed/astro' },
      { folder: automotiveFolder, album: automotiveAlbum, path: 'public/images/processed/automotive' },
      { folder: concertsFolder, album: concertsAlbum, path: 'public/images/processed/concerts' },
      { folder: streetFolder, album: streetAlbum, path: 'public/images/processed/street' }
    ];
    
    // Import blog post photos
    const blogPaths = [
      { folder: auroraFolder, album: auroraAlbum, path: 'public/images/blog-posts/aurora-june-2-2025' },
      { folder: pomeloFolder, album: pomeloAlbum, path: 'public/images/blog-posts/pomelo-soda-aug-9-2025' },
      { folder: stargazingFolder, album: stargazingAlbum, path: 'public/images/blog-posts/stargazing-denholm-july-25-2025' }
    ];
    
    const allPaths = [...processedPaths, ...blogPaths];
    
    let totalProcessed = 0;
    let totalCreated = 0;
    let totalSkipped = 0;
    
    for (const { folder, album, path: folderPath } of allPaths) {
      console.log(`\n📁 Processing: ${folder.name}`);
      
      if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Path does not exist: ${folderPath}`);
        continue;
      }
      
      const files = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      console.log(`   Found ${files.length} image files`);
      
      for (const file of files) {
        try {
          const filePath = path.join(folderPath, file);
          const checksum = generateChecksum(filePath);
          
          // Check for duplicates
          const existingImage = await prisma.image.findUnique({
            where: { checksum }
          });
          
          if (existingImage) {
            console.log(`   ⏭️  Skipped duplicate: ${file}`);
            totalSkipped++;
            continue;
          }
          
          // Create image record
          const image = await prisma.image.create({
            data: {
              filename: file,
              checksum,
              title: path.parse(file).name,
              category: folder.name.toLowerCase().replace(' photography', ''),
              folderId: folder.id,
              tags: [folder.name.toLowerCase().replace(' photography', '')]
            }
          });
          
          // Add to album
          await prisma.albumImage.create({
            data: {
              albumId: album.id,
              imageId: image.id,
              order: totalCreated + 1
            }
          });
          
          console.log(`   ✅ Imported: ${file}`);
          totalCreated++;
          
        } catch (error) {
          console.error(`   ❌ Error processing ${file}:`, error.message);
        }
        
        totalProcessed++;
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`   📊 Total processed: ${totalProcessed}`);
    console.log(`   ✅ Created: ${totalCreated}`);
    console.log(`   ⏭️  Skipped (duplicates): ${totalSkipped}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importExistingPhotos();
