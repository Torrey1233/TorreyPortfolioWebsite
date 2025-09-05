#!/usr/bin/env node

// Quick setup script for the photo organization system
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up Photo Organization System...\n');

// Check if .env exists and has DATABASE_URL
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Found existing .env file');
} else {
  console.log('📝 Creating .env file...');
  envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/torrey_portfolio?schema=public"

# AWS S3 Configuration (optional for now)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=torrey-portfolio-images

# Image Processing
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/tiff

# Organization Strategies
DEFAULT_ORGANIZATION_STRATEGY=date_based
DEFAULT_FILENAME_TEMPLATE="\${YYYY}-\${MM}-\${DD}_\${slug}_\${shortId}.\${ext}"
`;
  fs.writeFileSync(envPath, envContent);
}

// Check if DATABASE_URL is still SQLite
if (envContent.includes('file:./dev.db')) {
  console.log('⚠️  DATABASE_URL is still set to SQLite');
  console.log('📋 Please update your .env file with a PostgreSQL connection string');
  console.log('🔗 See setup-database.md for instructions\n');
}

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

console.log('🎉 Setup complete!\n');
console.log('📋 Next steps:');
console.log('1. Update your .env file with a PostgreSQL DATABASE_URL');
console.log('2. Run: npm run db:migrate');
console.log('3. Run: npm run db:seed');
console.log('4. Start your dev server: npm run dev');
console.log('5. Visit /admin to access the photo management system\n');

console.log('📚 For detailed setup instructions, see:');
console.log('   - setup-database.md (database setup)');
console.log('   - PHOTO_ORGANIZATION_README.md (full documentation)');
