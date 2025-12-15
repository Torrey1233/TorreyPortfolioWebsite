import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaImages, 
  FaUpload,
  FaSearch,
  FaFilter,
  FaEye,
  FaTrash,
  FaExclamationTriangle,
  FaSync,
  FaCheckSquare,
  FaSquare
} from 'react-icons/fa';
import PhotoUploader from './PhotoUploader';

const API_BASE_URL = 'http://localhost:3001';

const AlbumManager = () => {
  const [allPhotos, setAllPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkApiConnection();
    if (apiAvailable) {
      fetchAllPhotos();
    }
  }, [apiAvailable]);

  useEffect(() => {
    filterAndSortPhotos();
  }, [allPhotos, searchTerm, filterCategory, sortBy]);

  const checkApiConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        signal: AbortSignal.timeout(2000)
      });
      const isAvailable = response.ok;
      setApiAvailable(isAvailable);
      if (!isAvailable) {
        setError('API server is not running. Please start the API server with "npm run api" or "npm run dev:full"');
      }
      return isAvailable;
    } catch (err) {
      setApiAvailable(false);
      setError('API server is not running. Please start the API server with "npm run api" or "npm run dev:full"');
      return false;
    }
  };

  const fetchAllPhotos = async () => {
    if (!apiAvailable) return;
    
    try {
      setLoading(true);
      console.log('Fetching all photos from API...');
      
      // Generate a single cache-busting timestamp for this fetch
      const cacheBuster = `?t=${Date.now()}`;
      
      // Fetch all images from database
      const imagesResponse = await fetch(`${API_BASE_URL}/api/images?limit=10000`);
      if (!imagesResponse.ok) {
        throw new Error(`API returned ${imagesResponse.status}: ${imagesResponse.statusText}`);
      }
      
      const imagesData = await imagesResponse.json();
      console.log('API response:', imagesData);
      console.log('Number of images from API:', imagesData.images?.length || 0);
      
      // Also fetch filesystem photos (photos that exist on disk but may not be in DB)
      let filesystemPhotos = [];
      try {
        const fsResponse = await fetch(`${API_BASE_URL}/api/images/filesystem`);
        if (fsResponse.ok) {
          const fsData = await fsResponse.json();
          console.log('Filesystem photos found:', fsData.found || 0);
          console.log('Photos in database:', fsData.inDatabase || 0);
          console.log('Photos NOT in database:', fsData.notInDatabase || 0);
          
          // Add filesystem-only photos (those not in database)
          if (fsData.files && Array.isArray(fsData.files)) {
            filesystemPhotos = fsData.files
              .filter(file => !file.inDatabase && file.source === 'filesystem')
              .map(file => ({
                id: `fs-${file.filename}`,
                filename: file.filename,
                title: file.filename.replace(/\.[^/.]+$/, ''), // Remove extension
                description: 'Photo from filesystem (not yet in database)',
                category: 'uploads',
                source: 'filesystem',
                folder: null,
                createdAt: file.modified,
                url: file.url,
                thumbnail: file.thumbnail
              }));
            console.log('Filesystem-only photos to add:', filesystemPhotos.length);
          }
        }
      } catch (fsError) {
        console.warn('Could not fetch filesystem photos:', fsError);
        // Non-critical, continue
      }
      
      // Also fetch blog posts to get their images
      const blogResponse = await fetch(`${API_BASE_URL}/api/blog-posts`);
      const blogData = await blogResponse.json();
      
      let photos = imagesData.images || [];
      console.log('Photos after initial fetch:', photos.length);
      
      // Add cache-busting timestamp to all photos
      photos = photos.map(photo => ({ ...photo, _cacheBuster: cacheBuster }));
      
      // Add filesystem-only photos
      const filesystemPhotosWithCache = filesystemPhotos.map(photo => ({ ...photo, _cacheBuster: cacheBuster }));
      photos = [...photos, ...filesystemPhotosWithCache];
      console.log('Photos after adding filesystem photos:', photos.length);
      
      // Add blog post images to the photos list
      if (blogData.blogPosts) {
        blogData.blogPosts.forEach(blogPost => {
          if (blogPost.images && Array.isArray(blogPost.images)) {
            blogPost.images.forEach(imageFilename => {
              // Check if this image already exists in photos
              const exists = photos.some(photo => photo.filename === imageFilename);
              if (!exists) {
                // Create a photo entry for blog images
                photos.push({
                  id: `blog-${blogPost.id}-${imageFilename}`,
                  filename: imageFilename,
                  title: imageFilename,
                  description: `From blog post: ${blogPost.title}`,
                  category: blogPost.category || 'blog',
                  date: blogPost.date,
                  _cacheBuster: cacheBuster,
                  source: 'blog',
                  blogPostId: blogPost.id,
                  blogPostTitle: blogPost.title,
                  folder: null
                });
              }
            });
          }
        });
      }
      
      console.log('Total photos after adding blog photos:', photos.length);
      console.log('Sample photos:', photos.slice(0, 3));
      
      setAllPhotos(photos);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError(`Failed to fetch photos: ${err.message}. Make sure the API server is running.`);
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPhotos = () => {
    let filtered = [...allPhotos];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(photo => photo.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        case 'title':
          return (a.title || a.filename || '').localeCompare(b.title || b.filename || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

    setFilteredPhotos(filtered);
  };

  const getImagePath = (photo) => {
    let path = '';
    if (photo.source === 'blog') {
      path = `/images/uploads/${photo.filename}`;
    } else if (photo.folder?.path) {
      const folderPath = photo.folder.path.replace('/photos/', '');
      path = `/images/${folderPath}/${photo.filename}`;
    } else {
      path = `/images/uploads/${photo.filename}`;
    }
    // Use API base URL for images with cache-busting query parameter
    // Use a timestamp based on when photos were fetched (stored in component state)
    const cacheBuster = photo._cacheBuster || `?t=${Date.now()}`;
    return `${API_BASE_URL}${path}${cacheBuster}`;
  };

  const getThumbnailPath = (photo) => {
    const path = `/images/thumbnails/${photo.filename}`;
    // Use API base URL for thumbnails with cache-busting query parameter
    const cacheBuster = photo._cacheBuster || `?t=${Date.now()}`;
    return `${API_BASE_URL}${path}${cacheBuster}`;
  };

  const handleUploadComplete = async (uploadedImages) => {
    // Refresh the photos list to show newly uploaded photos
    console.log('Upload complete, refreshing photos list...', uploadedImages);
    // Wait a moment for the database to sync
    await new Promise(resolve => setTimeout(resolve, 500));
    await fetchAllPhotos();
    // Don't close the modal here - let PhotoUploader handle it
    // setShowPhotoUploader(false);
  };

  const syncPhotos = async () => {
    // Just refresh the photos list - filesystem photos are now shown automatically
    await fetchAllPhotos();
    setSyncResult({
      message: 'Photos refreshed. Filesystem photos are now visible in the list.'
    });
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) return;
    
    if (!apiAvailable) {
      setError('API server is not available');
      return;
    }

    // Check if this is a blog photo (virtual entry)
    const photo = allPhotos.find(p => p.id === photoId);
    if (photo && photo.source === 'blog') {
      setError('Cannot delete blog photos directly. Remove them from the blog post first.');
      return;
    }

    try {
      // Check if this is a filesystem photo (ID starts with 'fs-')
      let response;
      if (photoId.startsWith('fs-')) {
        // Extract filename from filesystem ID
        const filename = photoId.replace(/^fs-/, '');
        // Delete by filename (using POST since DELETE doesn't reliably support body)
        response = await fetch(`${API_BASE_URL}/api/images/delete-by-filename`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename })
        });
      } else {
        // Regular database photo - delete by ID
        response = await fetch(`${API_BASE_URL}/api/images/${photoId}`, {
          method: 'DELETE'
        });
      }

      if (response.ok) {
        fetchAllPhotos();
        setSelectedPhotos(new Set());
      } else {
        // Try to parse JSON, but handle HTML 404 pages
        let errorMessage = 'Failed to delete photo';
        try {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        } catch (parseError) {
          // Response is not JSON (probably HTML 404 page)
          if (response.status === 404) {
            errorMessage = 'Delete endpoint not found. Please restart the API server (npm run api)';
          } else {
            errorMessage = `Server error (${response.status}). Please check the API server.`;
          }
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError(`Failed to delete photo: ${err.message}`);
      console.error('Delete error:', err);
    }
  };

  const deleteSelectedPhotos = async () => {
    const selectedArray = Array.from(selectedPhotos);
    if (selectedArray.length === 0) return;

    const count = selectedArray.length;
    if (!confirm(`Are you sure you want to delete ${count} photo(s)? This action cannot be undone.`)) return;

    if (!apiAvailable) {
      setError('API server is not available');
      return;
    }

    setDeleting(true);
    setError(null);

    // Filter out blog photos
    const photosToDelete = selectedArray.filter(id => {
      const photo = allPhotos.find(p => p.id === id);
      return photo && photo.source !== 'blog';
    });

    const blogPhotos = selectedArray.filter(id => {
      const photo = allPhotos.find(p => p.id === id);
      return photo && photo.source === 'blog';
    });

    if (blogPhotos.length > 0) {
      setError(`${blogPhotos.length} blog photo(s) cannot be deleted directly. Remove them from blog posts first.`);
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Delete photos in parallel
    const deletePromises = photosToDelete.map(async (photoId) => {
      try {
        let response;
        if (photoId.startsWith('fs-')) {
          const filename = photoId.replace(/^fs-/, '');
          response = await fetch(`${API_BASE_URL}/api/images/delete-by-filename`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
          });
        } else {
          response = await fetch(`${API_BASE_URL}/api/images/${photoId}`, {
            method: 'DELETE'
          });
        }

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
          const photo = allPhotos.find(p => p.id === photoId);
          errors.push(photo?.filename || photoId);
        }
      } catch (err) {
        errorCount++;
        const photo = allPhotos.find(p => p.id === photoId);
        errors.push(photo?.filename || photoId);
        console.error(`Failed to delete ${photoId}:`, err);
      }
    });

    await Promise.all(deletePromises);

    setDeleting(false);
    setSelectedPhotos(new Set());

    if (successCount > 0) {
      fetchAllPhotos();
    }

    if (errorCount > 0) {
      setError(`Failed to delete ${errorCount} photo(s). ${successCount} deleted successfully.`);
    } else if (successCount > 0) {
      setError(null);
    }
  };

  const togglePhotoSelection = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
    }
  };

  // Get unique categories from photos
  const categories = ['all', ...new Set(allPhotos.map(p => p.category).filter(Boolean))];

  if (loading && apiAvailable) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Album Manager - All Photos</h2>
          <p className="text-gray-600">View and manage all uploaded photos including blog photos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncPhotos}
            disabled={syncing || !apiAvailable}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              <>
                <FaSync className="w-4 h-4" />
                Sync Photos
              </>
            )}
          </button>
        <button
            onClick={() => setShowPhotoUploader(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            <FaUpload className="w-4 h-4" />
            Upload Photos
        </button>
        </div>
      </div>

      {/* API Connection Warning */}
      {!apiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <FaExclamationTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-1">API Server Not Running</h3>
            <p className="text-sm text-yellow-700 mb-2">{error}</p>
            <p className="text-xs text-yellow-600">
              Run: <code className="bg-yellow-100 px-2 py-1 rounded">npm run api</code> or <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev:full</code>
            </p>
            <button
              onClick={checkApiConnection}
              className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!apiAvailable}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!apiAvailable}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!apiAvailable}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div className={`p-4 border rounded ${
          syncResult.imported > 0 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Sync Complete</h3>
              <p className="text-sm">
                Found: {syncResult.found} photos • 
                Imported: {syncResult.imported} • 
                Skipped: {syncResult.skipped} • 
                Errors: {syncResult.errors || 0}
              </p>
              {syncResult.firstError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs">
                  <strong>First Error:</strong> {syncResult.firstError}
                </div>
              )}
            </div>
            <button
              onClick={() => setSyncResult(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && apiAvailable && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Selection Controls */}
      {filteredPhotos.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {selectedPhotos.size === filteredPhotos.length ? (
                <FaCheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <FaSquare className="w-5 h-5 text-gray-400" />
              )}
              <span>
                {selectedPhotos.size === filteredPhotos.length ? 'Deselect All' : 'Select All'}
              </span>
            </button>
            {selectedPhotos.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedPhotos.size} photo(s) selected
              </span>
            )}
          </div>
          {selectedPhotos.size > 0 && (
            <button
              onClick={deleteSelectedPhotos}
              disabled={deleting || !apiAvailable}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="w-4 h-4" />
                  Delete Selected ({selectedPhotos.size})
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">Total Photos</p>
            <p className="text-2xl font-bold text-blue-900">{allPhotos.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Showing</p>
            <p className="text-2xl font-bold text-blue-900">{filteredPhotos.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Categories</p>
            <p className="text-2xl font-bold text-blue-900">{categories.length - 1}</p>
          </div>
          <div>
            <button
              onClick={fetchAllPhotos}
              disabled={loading || !apiAvailable}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              title="Refresh photos list"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative group cursor-pointer bg-white rounded-lg border-2 overflow-hidden hover:shadow-lg transition-all ${
              selectedPhotos.has(photo.id) 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200'
            }`}
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Selection Checkbox */}
            <div 
              className="absolute top-2 left-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                togglePhotoSelection(photo.id);
              }}
            >
              <button
                className={`p-1 rounded bg-white shadow-md hover:bg-gray-100 transition-colors ${
                  selectedPhotos.has(photo.id) ? 'text-blue-600' : 'text-gray-400'
                }`}
                title={selectedPhotos.has(photo.id) ? 'Deselect' : 'Select'}
              >
                {selectedPhotos.has(photo.id) ? (
                  <FaCheckSquare className="w-5 h-5" />
                ) : (
                  <FaSquare className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="relative w-full h-32 bg-gray-100">
                <img
                src={getThumbnailPath(photo)}
                alt={photo.title || photo.filename}
                  className="w-full h-full object-cover"
                loading={index < 20 ? "eager" : "lazy"}
                  onError={(e) => {
                  e.target.src = getImagePath(photo);
                    e.target.onerror = () => {
                      e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                    };
                  }}
                />
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                <FaImages className="w-8 h-8" />
              </div>
              
              {/* Source Badge */}
              {photo.source === 'blog' && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Blog
                </div>
              )}
              {photo.source === 'filesystem' && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                  Filesystem
                </div>
              )}
              
              {/* Delete Button */}
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePhoto(photo.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity"
                title="Delete photo"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            
            {/* Photo Info */}
            <div className="p-2">
              <p className="text-xs font-medium text-gray-900 truncate" title={photo.title || photo.filename}>
                {photo.title || photo.filename}
              </p>
              {photo.source === 'blog' && (
                <p className="text-xs text-gray-500 truncate" title={photo.blogPostTitle}>
                  {photo.blogPostTitle}
                </p>
              )}
              {photo.category && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                  {photo.category}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter terms.' 
              : 'Upload your first photos to get started.'}
          </p>
          {!searchTerm && filterCategory === 'all' && (
            <button
              onClick={() => setShowPhotoUploader(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Photos
            </button>
          )}
        </div>
      )}

      {/* Photo Uploader Modal */}
      {showPhotoUploader && (
        <PhotoUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowPhotoUploader(false)}
        />
      )}

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedPhoto.title || selectedPhoto.filename}</h3>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={getImagePath(selectedPhoto)}
                  alt={selectedPhoto.title || selectedPhoto.filename}
                  className="w-full h-auto rounded-lg mb-4"
                />
                <div className="space-y-2">
                  {selectedPhoto.description && (
                    <p className="text-gray-700">{selectedPhoto.description}</p>
                  )}
                  {selectedPhoto.source === 'blog' && (
                    <p className="text-sm text-green-600">From blog post: {selectedPhoto.blogPostTitle}</p>
                  )}
                  {selectedPhoto.category && (
                    <p className="text-sm text-gray-600">Category: {selectedPhoto.category}</p>
                  )}
                  {selectedPhoto.date && (
                    <p className="text-sm text-gray-600">Date: {selectedPhoto.date}</p>
                )}
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumManager;
