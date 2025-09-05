# Smart Photo Organization System

A comprehensive photo management system for your portfolio website with advanced folder organization, virtual albums, bulk import capabilities, and intelligent deduplication.

## 🚀 Features

### 📁 Smart Folder Organization
- **Multiple Organization Strategies**: Date-based, post-based, tag-based, or custom templates
- **Hierarchical Folder Structure**: Nested folders with parent-child relationships
- **Dynamic Folder Creation**: Automatically creates folders based on organization rules
- **Folder Management UI**: Tree view with drag-and-drop support

### 🖼️ Virtual Albums & Collections
- **Lightroom-style Albums**: Virtual collections that don't move physical files
- **Drag-and-Drop Reordering**: Easy image arrangement within albums
- **Album Covers**: Automatic or manual cover image selection
- **Smart Albums**: Saved filters for dynamic album creation

### 📥 Bulk Import System
- **Multiple Import Modes**: Scan-only, copy, or move files
- **Intelligent Deduplication**: SHA256 checksum-based duplicate detection
- **EXIF Data Extraction**: Automatic metadata extraction from image files
- **Progress Tracking**: Real-time import progress with detailed statistics
- **Background Processing**: Non-blocking import jobs with status updates

### 🗄️ Advanced Storage Management
- **S3/R2 Integration**: Cloud storage with automatic optimization
- **Image Variants**: Original, optimized, and thumbnail generation
- **Signed URLs**: Secure, time-limited access to images
- **Storage Analytics**: Usage tracking and optimization insights

## 🏗️ Architecture

### Database Schema (Prisma)
```prisma
model Image {
  id            String   @id @default(cuid())
  folderId      String?  // Physical folder location
  checksum      String?  @unique // SHA256 for deduplication
  filename      String?  // S3 storage filename
  // ... existing metadata fields
}

model Folder {
  id          String   @id @default(cuid())
  name        String
  path        String   @unique  // Logical path
  parentId    String?  // Hierarchical structure
  children    Folder[] @relation("FolderToChildren")
  images      Image[]  // Images in this folder
}

model Album {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  images      AlbumImage[] // Virtual collection
}

model ImportJob {
  id          String   @id @default(cuid())
  sourcePath  String
  mode        ImportMode
  status      ImportStatus
  // ... progress tracking fields
}
```

### Organization Strategies

#### 1. Date-Based Organization
```
/photos/2025/09/11/2025-09-11_shortId.webp
```

#### 2. Post-Based Organization
```
/posts/my-photo-shoot/001_basename.webp
```

#### 3. Tag-Based Organization
```
/tags/street/2025-09-11_shortId.webp
```

#### 4. Custom Template
```
/custom/2025/09/2025-09-11_my-shoot_shortId.webp
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install prisma @prisma/client next-auth bcryptjs sharp multer @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install --save-dev @types/bcryptjs @types/multer
```

### 2. Database Setup
```bash
# Initialize Prisma
npx prisma init

# Set up your database URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/torrey_portfolio?schema=public"

# Run migrations
npx prisma migrate dev
```

### 3. Environment Configuration
Create a `.env` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/torrey_portfolio?schema=public"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=torrey-portfolio-images

# Image Processing
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/tiff

# Organization Strategies
DEFAULT_ORGANIZATION_STRATEGY=date_based
DEFAULT_FILENAME_TEMPLATE="${YYYY}-${MM}-${DD}_${slug}_${shortId}.${ext}"
```

### 4. S3 Bucket Setup
Create an S3 bucket with the following structure:
```
your-bucket/
├── originals/     # Original uploaded files
├── optimized/     # WebP optimized versions
└── thumbs/        # Thumbnail versions
```

## 📱 Admin Interface

Access the admin panel at `/admin` with the following sections:

### Folder Manager
- **Tree View**: Hierarchical folder structure with expand/collapse
- **Create/Edit/Delete**: Full CRUD operations for folders
- **Apply Strategy**: Reorganize existing folders with new strategies
- **Image Counts**: See how many images are in each folder

### Album Manager
- **Virtual Collections**: Create albums without moving files
- **Image Picker**: Add/remove images from albums
- **Drag-and-Drop**: Reorder images within albums
- **Album Covers**: Set cover images for visual representation

### Import Panel
- **Bulk Import**: Import entire directories of photos
- **Progress Tracking**: Real-time import progress with statistics
- **Deduplication**: Automatic duplicate detection and handling
- **Job History**: View past import jobs and their results

## 🔧 API Endpoints

### Folders
- `GET /api/folders` - Get folder tree
- `POST /api/folders` - Create new folder
- `PATCH /api/folders/:id` - Update folder
- `DELETE /api/folders/:id` - Delete folder
- `POST /api/folders/apply-strategy` - Apply organization strategy

### Albums
- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create new album
- `PATCH /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `POST /api/albums/:id/images` - Add images to album
- `DELETE /api/albums/:id/images/:imageId` - Remove image from album

### Import
- `GET /api/import` - Get import jobs
- `POST /api/import` - Start new import job
- `GET /api/import/:id/status` - Get import job status
- `POST /api/import/:id/cancel` - Cancel import job

### Images
- `GET /api/images` - Get images with filters
- `PATCH /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image
- `POST /api/images/:id/rename` - Rename image
- `POST /api/images/:id/move` - Move image to different folder

## 🎯 Usage Examples

### 1. Organize Photos by Date
```javascript
// Apply date-based organization to a folder
const response = await fetch('/api/folders/apply-strategy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    folderId: 'folder-id',
    strategy: 'date_based'
  })
});
```

### 2. Create a Virtual Album
```javascript
// Create a new album
const album = await fetch('/api/albums', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Street Photography 2025',
    slug: 'street-photography-2025',
    description: 'My best street photography from 2025'
  })
});

// Add images to the album
await fetch(`/api/albums/${album.id}/images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageIds: ['image1', 'image2', 'image3']
  })
});
```

### 3. Bulk Import Photos
```javascript
// Start a bulk import job
const importJob = await fetch('/api/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sourcePath: '/path/to/photos',
    mode: 'INGEST_COPY',
    organizationStrategy: 'date_based',
    deduplicate: true,
    generateThumbnails: true,
    category: 'street',
    tags: ['urban', 'golden-hour']
  })
});
```

## 🔄 Migration from Existing System

### 1. Backup Current Data
```bash
# Backup your current photography-data.js
cp src/data/photography-data.js src/data/photography-data.js.backup
```

### 2. Run Initial Import
```javascript
// Use the import system to migrate existing photos
const importJob = await fetch('/api/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sourcePath: 'public/images/processed',
    mode: 'SCAN_ONLY', // First run in scan mode
    organizationStrategy: 'date_based',
    deduplicate: true
  })
});
```

### 3. Update Photography Component
The existing `Photography.jsx` component will continue to work, but you can now also:
- Use the admin interface for management
- Leverage the new API endpoints
- Take advantage of virtual albums

## 🚀 Advanced Features

### Smart Albums with Filters
```javascript
// Create a smart album that automatically includes images matching criteria
const smartAlbum = {
  name: 'Recent Street Photos',
  filters: {
    category: 'street',
    dateFrom: '2025-01-01',
    tags: ['urban', 'golden-hour']
  }
};
```

### Export and Archive
```javascript
// Export album as ZIP
const exportResponse = await fetch(`/api/albums/${albumId}/export`, {
  method: 'POST',
  body: JSON.stringify({
    format: 'web', // or 'original'
    includeMetadata: true
  })
});
```

### Watch Folder Integration
```javascript
// Set up automatic import from watched folder
const watchJob = await fetch('/api/import/watch', {
  method: 'POST',
  body: JSON.stringify({
    watchPath: '/path/to/drop/folder',
    organizationStrategy: 'date_based',
    autoProcess: true
  })
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Run `npx prisma migrate dev` to apply schema

2. **S3 Upload Failures**
   - Check AWS credentials
   - Verify S3 bucket permissions
   - Ensure bucket exists and is accessible

3. **Import Job Failures**
   - Check source path exists and is readable
   - Verify file permissions
   - Review import job logs in admin panel

4. **Image Processing Errors**
   - Ensure Sharp is properly installed
   - Check available disk space
   - Verify image file formats are supported

### Performance Optimization

1. **Database Indexing**
   ```sql
   CREATE INDEX idx_images_checksum ON images(checksum);
   CREATE INDEX idx_images_category ON images(category);
   CREATE INDEX idx_images_date ON images(date);
   ```

2. **S3 Optimization**
   - Use CloudFront for image delivery
   - Enable S3 Transfer Acceleration
   - Set appropriate cache headers

3. **Import Performance**
   - Process images in batches
   - Use background workers for large imports
   - Implement progress persistence

## 📈 Future Enhancements

- **AI-Powered Tagging**: Automatic tag generation using computer vision
- **Face Recognition**: Group photos by people
- **Geolocation**: Organize by GPS coordinates
- **Color Analysis**: Group by dominant colors
- **Similarity Detection**: Find visually similar images
- **Batch Editing**: Apply metadata changes to multiple images
- **Plugin System**: Extensible organization strategies
- **Mobile App**: Companion app for photo management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is part of your portfolio website. All rights reserved.

---

For more detailed documentation, visit the admin panel at `/admin` or check the inline code comments for implementation details.

