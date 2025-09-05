// Debug API server
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = 3001;

// Simple in-memory storage for demo purposes
let folders = [
  {
    id: '1',
    name: 'Root',
    path: '/',
    children: [],
    _count: { images: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let albums = [
  {
    id: '1',
    name: 'Sample Album',
    slug: 'sample-album',
    description: 'A sample album',
    _count: { images: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let importJobs = [
  {
    id: '1',
    sourcePath: '/sample/path',
    mode: 'SCAN_ONLY',
    status: 'DONE',
    created: 0,
    skipped: 0,
    deduped: 0,
    errors: 0,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString()
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'OK',
    databaseUrl: process.env.DATABASE_URL ? 'Found' : 'Not found',
    nodeEnv: process.env.NODE_ENV || 'undefined',
    timestamp: new Date().toISOString()
  });
});

// Simple folders endpoint
app.get('/api/folders', (req, res) => {
  res.json({ folders });
});

// POST endpoint for creating folders
app.post('/api/folders', (req, res) => {
  const { name, path, parentId } = req.body;
  
  // Generate a mock ID
  const newFolder = {
    id: `folder_${Date.now()}`,
    name: name || 'New Folder',
    path: path || '/new-folder',
    parentId: parentId || null,
    children: [],
    _count: { images: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to in-memory storage
  folders.push(newFolder);
  
  res.status(201).json({ folder: newFolder });
});

// Simple albums endpoint
app.get('/api/albums', (req, res) => {
  res.json({ albums });
});

// POST endpoint for creating albums
app.post('/api/albums', (req, res) => {
  const { name, slug, description } = req.body;
  
  // Generate a mock ID
  const newAlbum = {
    id: `album_${Date.now()}`,
    name: name || 'New Album',
    slug: slug || 'new-album',
    description: description || '',
    _count: { images: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to in-memory storage
  albums.push(newAlbum);
  
  res.status(201).json({ album: newAlbum });
});

// Mock images endpoint
app.get('/api/images', (req, res) => {
  res.json({
    images: [
      {
        id: '1',
        title: 'Sample Image',
        filename: 'sample.jpg',
        category: 'photography',
        tags: ['sample', 'test'],
        featured: false,
        createdAt: new Date().toISOString()
      }
    ]
  });
});

// Mock import endpoint
app.get('/api/import', (req, res) => {
  res.json({ importJobs });
});

// POST endpoint for starting import jobs
app.post('/api/import', (req, res) => {
  const { sourcePath, mode } = req.body;
  
  const newImportJob = {
    id: `import_${Date.now()}`,
    sourcePath: sourcePath || '/sample/path',
    mode: mode || 'SCAN_ONLY',
    status: 'PENDING',
    created: 0,
    skipped: 0,
    deduped: 0,
    errors: 0,
    startedAt: new Date().toISOString(),
    finishedAt: null
  };
  
  // Add to in-memory storage
  importJobs.push(newImportJob);
  
  res.status(201).json({ importJob: newImportJob });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Debug API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Debug API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Debug info: http://localhost:${PORT}/api/debug`);
});

export default app;
