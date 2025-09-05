// Database seeding script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create initial organization strategies
  const strategies = [
    {
      name: 'date_based',
      description: 'Organize photos by date (YYYY/MM/DD)',
      template: 'photos/${YYYY}/${MM}/${DD}',
      filenameTemplate: '${YYYY}-${MM}-${DD}_${shortId}.${ext}',
      active: true,
    },
    {
      name: 'post_based',
      description: 'Organize photos by blog post slug',
      template: 'posts/${slug}',
      filenameTemplate: '${order}_${basename}.${ext}',
      active: false,
    },
    {
      name: 'tag_based',
      description: 'Organize photos by primary tag',
      template: 'tags/${primary_tag}',
      filenameTemplate: '${YYYY}-${MM}-${DD}_${shortId}.${ext}',
      active: false,
    },
  ];

  for (const strategy of strategies) {
    await prisma.organizationStrategy.upsert({
      where: { name: strategy.name },
      update: strategy,
      create: strategy,
    });
  }

  // Create root folder
  const rootFolder = await prisma.folder.upsert({
    where: { path: '/' },
    update: {},
    create: {
      name: 'Root',
      path: '/',
    },
  });

  // Create some sample folders
  const sampleFolders = [
    {
      name: '2025',
      path: '/photos/2025',
      parentId: rootFolder.id,
    },
    {
      name: '09',
      path: '/photos/2025/09',
      parentId: null, // Will be set after 2025 folder is created
    },
    {
      name: '11',
      path: '/photos/2025/09/11',
      parentId: null, // Will be set after 09 folder is created
    },
  ];

  let parentId = rootFolder.id;
  for (const folder of sampleFolders) {
    const createdFolder = await prisma.folder.upsert({
      where: { path: folder.path },
      update: { parentId },
      create: {
        ...folder,
        parentId,
      },
    });
    parentId = createdFolder.id;
  }

  // Create a sample album
  const sampleAlbum = await prisma.album.upsert({
    where: { slug: 'sample-album' },
    update: {},
    create: {
      name: 'Sample Album',
      slug: 'sample-album',
      description: 'A sample album to demonstrate the system',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📁 Created folders and organization strategies');
  console.log('🖼️ Created sample album');
  console.log('🚀 You can now access the admin panel at /admin');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
