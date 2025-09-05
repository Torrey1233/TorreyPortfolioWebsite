import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaImages, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSort,
  FaSearch,
  FaFilter,
  FaUpload
} from 'react-icons/fa';
import PhotoUploader from './PhotoUploader';

const AlbumManager = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Form states
  const [newAlbum, setNewAlbum] = useState({ name: '', slug: '', description: '' });
  const [editAlbum, setEditAlbum] = useState({ id: '', name: '', slug: '', description: '' });
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Keyboard shortcuts for image picker
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showImagePicker) {
        if (event.ctrlKey && event.key === 'a') {
          event.preventDefault();
          selectAllImages();
        }
        if (event.key === 'Escape') {
          setShowImagePicker(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImagePicker, availableImages]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/albums');
      const data = await response.json();
      
      if (response.ok) {
        setAlbums(data.albums);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableImages = async () => {
    try {
      setLoadingImages(true);
      console.log('Fetching images with limit=1000...');
      const response = await fetch(`http://localhost:3001/api/images?limit=1000&t=${Date.now()}`);
      const data = await response.json();
      
      console.log('Received images:', data.images?.length || 0);
      if (response.ok) {
        setAvailableImages(data.images);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlbum),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewAlbum({ name: '', slug: '', description: '' });
        fetchAlbums();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create album');
    }
  };

  const updateAlbum = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/albums/${editAlbum.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editAlbum),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditAlbum({ id: '', name: '', slug: '', description: '' });
        fetchAlbums();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update album');
    }
  };

  const deleteAlbum = async (albumId) => {
    if (!confirm('Are you sure you want to delete this album?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAlbums();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete album');
    }
  };

  const addImagesToAlbum = async () => {
    if (!selectedAlbum || selectedImages.length === 0) return;

    try {
      const response = await fetch(`/api/albums/${selectedAlbum.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIds: selectedImages }),
      });

      if (response.ok) {
        setShowImagePicker(false);
        setSelectedImages([]);
        fetchAlbums();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add images to album');
    }
  };

  const removeImageFromAlbum = async (albumId, imageId) => {
    try {
      const response = await fetch(`/api/albums/${albumId}/images/${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAlbums();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to remove image from album');
    }
  };

  const openEditModal = (album) => {
    setEditAlbum({
      id: album.id,
      name: album.name,
      slug: album.slug,
      description: album.description || '',
    });
    setShowEditModal(true);
  };

  const openImagePicker = (album) => {
    setSelectedAlbum(album);
    setSelectedImages([]);
    fetchAvailableImages();
    setShowImagePicker(true);
  };

  const toggleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    const allImageIds = availableImages.map(img => img.id);
    setSelectedImages(allImageIds);
  };

  const deselectAllImages = () => {
    setSelectedImages([]);
  };

  const handleImageClick = (imageId, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + Click: Toggle individual selection
      toggleImageSelection(imageId);
    } else if (event.shiftKey && selectedImages.length > 0) {
      // Shift + Click: Select range
      const currentIndex = availableImages.findIndex(img => img.id === imageId);
      const lastSelectedIndex = availableImages.findIndex(img => img.id === selectedImages[selectedImages.length - 1]);
      
      const startIndex = Math.min(currentIndex, lastSelectedIndex);
      const endIndex = Math.max(currentIndex, lastSelectedIndex);
      
      const rangeIds = availableImages.slice(startIndex, endIndex + 1).map(img => img.id);
      setSelectedImages(prev => [...new Set([...prev, ...rangeIds])]);
    } else {
      // Regular click: Select only this image
      setSelectedImages([imageId]);
    }
  };

  const handleUploadComplete = (uploadedImages) => {
    // Refresh the available images list to include newly uploaded photos
    fetchAvailableImages();
    setShowPhotoUploader(false);
  };

  const filteredAlbums = albums.filter(album =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'createdAt':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'imageCount':
        return (b._count?.images || 0) - (a._count?.images || 0);
      default:
        return 0;
    }
  });

  if (loading) {
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
        <h2 className="text-2xl font-bold text-gray-900">Album Manager</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          New Album
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="imageCount">Sort by Image Count</option>
        </select>
      </div>

      {/* Error Display */}
      {error && (
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

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAlbums.map((album) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Album Cover */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {album.coverImage ? (
                <img
                  src={`/images/thumbnails/${album.coverImage.filename}`}
                  alt={album.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to original image if thumbnail fails
                    const originalPath = `/images/${album.coverImage.folder?.path?.replace('/photos/', '') || 'uploads'}/${album.coverImage.filename}`;
                    e.target.src = originalPath;
                    e.target.onerror = () => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    };
                  }}
                />
              ) : album.images && album.images.length > 0 ? (
                <img
                  src={`/images/thumbnails/${album.images[0].image.filename}`}
                  alt={album.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to original image if thumbnail fails
                    const originalPath = `/images/${album.images[0].image.folder?.path?.replace('/photos/', '') || 'uploads'}/${album.images[0].image.filename}`;
                    e.target.src = originalPath;
                    e.target.onerror = () => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    };
                  }}
                />
              ) : (
                <FaImages className="w-12 h-12 text-gray-400" />
              )}
              {/* Fallback placeholder */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                <FaImages className="w-12 h-12" />
              </div>
            </div>

            {/* Album Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{album.name}</h3>
              {album.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{album.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{album._count?.images || 0} images</span>
                <span>{new Date(album.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openImagePicker(album)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  <FaPlus className="w-3 h-3" />
                  Add Images
                </button>
                <button
                  onClick={() => openEditModal(album)}
                  className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                  title="Edit album"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteAlbum(album.id)}
                  className="p-2 bg-red-200 text-red-600 rounded-md hover:bg-red-300 transition-colors"
                  title="Delete album"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedAlbums.length === 0 && (
        <div className="text-center py-12">
          <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Create your first album to get started.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Album
            </button>
          )}
        </div>
      )}

      {/* Create Album Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Create New Album</h3>
              <form onSubmit={createAlbum} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Album Name
                  </label>
                  <input
                    type="text"
                    value={newAlbum.name}
                    onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newAlbum.slug}
                    onChange={(e) => setNewAlbum({ ...newAlbum, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newAlbum.description}
                    onChange={(e) => setNewAlbum({ ...newAlbum, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Album Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Album</h3>
              <form onSubmit={updateAlbum} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Album Name
                  </label>
                  <input
                    type="text"
                    value={editAlbum.name}
                    onChange={(e) => setEditAlbum({ ...editAlbum, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editAlbum.slug}
                    onChange={(e) => setEditAlbum({ ...editAlbum, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editAlbum.description}
                    onChange={(e) => setEditAlbum({ ...editAlbum, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Picker Modal */}
      <AnimatePresence>
        {showImagePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Add Images to "{selectedAlbum?.name}"
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPhotoUploader(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                  >
                    <FaUpload className="w-4 h-4" />
                    Upload New Photos
                  </button>
                  <button
                    onClick={() => setShowImagePicker(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Selection Controls */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {selectedImages.length} of {availableImages.length} selected
                  </span>
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Shortcuts:</span> Ctrl+A (Select All) • Ctrl+Click (Toggle) • Shift+Click (Range) • Esc (Close)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllImages}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllImages}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4">
                {loadingImages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading images...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {availableImages.map((image, index) => {
                    // Construct image path based on folder structure
                    let imagePath = '';
                    if (image.folder?.path) {
                      // For images in folders, use the folder path
                      const folderPath = image.folder.path.replace('/photos/', '');
                      imagePath = `/images/${folderPath}/${image.filename}`;
                    } else {
                      // Fallback to uploads directory
                      imagePath = `/images/uploads/${image.filename}`;
                    }
                    
                    return (
                                       <div
                   key={image.id}
                   className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                     selectedImages.includes(image.id)
                       ? 'border-blue-500'
                       : 'border-gray-200 hover:border-gray-300'
                   }`}
                   onClick={(e) => handleImageClick(image.id, e)}
                 >
                        <div className="relative w-full h-24 bg-gray-100">
                          <img
                            src={`/images/thumbnails/${image.filename}`}
                            alt={image.title || image.filename || 'Image'}
                            className="w-full h-full object-cover"
                            loading={index < 20 ? "eager" : "lazy"}
                            onError={(e) => {
                              // Fallback to original image if thumbnail fails to load
                              e.target.src = imagePath;
                              e.target.onerror = () => {
                                // Final fallback to placeholder
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              };
                            }}
                          />
                          <div 
                            className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
                            style={{ display: 'none' }}
                          >
                            <FaImages className="w-6 h-6" />
                          </div>
                        </div>
                        
                        {/* Image info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-1">
                          <p className="text-xs truncate">
                            {image.title || image.filename || 'Untitled'}
                          </p>
                        </div>
                        
                        {selectedImages.includes(image.id) && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addImagesToAlbum}
                  disabled={selectedImages.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
                </button>
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Uploader Modal */}
      <AnimatePresence>
        {showPhotoUploader && (
          <PhotoUploader
            onUploadComplete={handleUploadComplete}
            onClose={() => setShowPhotoUploader(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlbumManager;

