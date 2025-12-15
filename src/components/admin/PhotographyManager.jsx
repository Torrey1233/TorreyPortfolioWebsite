import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaImages, 
  FaUpload,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaGripVertical,
  FaTrash,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaCheckSquare,
  FaSquare,
  FaTag,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaMusic,
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaPlus
} from 'react-icons/fa';
import PhotoUploader from './PhotoUploader';
import { photoCategories } from '../../data/photography-data.js';

const API_BASE_URL = 'http://localhost:3001';

// Concert Manager Modal Component
const ConcertManagerModal = ({
  concerts,
  editingConcert,
  photos,
  selectedPhotos,
  onClose,
  onCreateConcert,
  onUpdateConcert,
  onDeleteConcert,
  onAssignPhotos,
  onRemovePhoto
}) => {
  const [name, setName] = useState(editingConcert?.name || '');
  const [description, setDescription] = useState(editingConcert?.description || '');
  const [date, setDate] = useState(editingConcert?.date || '');
  const [location, setLocation] = useState(editingConcert?.location || '');
  const [venue, setVenue] = useState(editingConcert?.venue || '');
  const [link, setLink] = useState(editingConcert?.link || '');
  const [selectedConcert, setSelectedConcert] = useState(null);

  useEffect(() => {
    if (editingConcert) {
      setName(editingConcert.name || '');
      setDescription(editingConcert.description || '');
      setDate(editingConcert.date || '');
      setLocation(editingConcert.location || '');
      setVenue(editingConcert.venue || '');
      setLink(editingConcert.link || '');
    } else {
      setName('');
      setDescription('');
      setDate('');
      setLocation('');
      setVenue('');
      setLink('');
    }
  }, [editingConcert]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a concert name');
      return;
    }

    const concertData = {
      name: name.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
      venue: venue.trim(),
      link: link.trim()
    };

    if (editingConcert) {
      onUpdateConcert(editingConcert.id, concertData);
    } else {
      onCreateConcert(concertData);
    }
    setName('');
    setDescription('');
    setDate('');
    setLocation('');
    setVenue('');
    setLink('');
    onClose();
  };

  const handleAssign = () => {
    if (!selectedConcert) {
      alert('Please select a concert');
      return;
    }
    if (selectedPhotos.size === 0) {
      alert('Please select photos to assign');
      return;
    }
    onAssignPhotos(Array.from(selectedPhotos), selectedConcert);
    setSelectedConcert(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingConcert ? 'Edit Concert' : 'Create Concert'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Concert Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Concert Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Coachella 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the concert..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., Coachella Valley"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link (Optional)
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/concert-page"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                When users click the concert name, they'll be taken to this link (opens in new tab)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {editingConcert ? 'Update Concert' : 'Create Concert'}
              </button>
              {editingConcert && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this concert? Photos will be unassigned.')) {
                      onDeleteConcert(editingConcert.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Assign Photos Section */}
          {selectedPhotos.size > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assign {selectedPhotos.size} Selected Photo{selectedPhotos.size !== 1 ? 's' : ''} to Concert
              </h3>
              <div className="flex gap-3">
                <select
                  value={selectedConcert || ''}
                  onChange={(e) => setSelectedConcert(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a concert...</option>
                  {concerts.map(concert => (
                    <option key={concert.id} value={concert.id}>
                      {concert.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedConcert}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* Existing Concerts List */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Concerts</h3>
            {concerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No concerts created yet</p>
            ) : (
              <div className="space-y-2">
                {concerts.map(concert => {
                  const concertPhotos = photos.filter(p => p.concertId === concert.id);
                  return (
                    <div
                      key={concert.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {concert.link ? (
                            <a
                              href={concert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                            >
                              {concert.name}
                            </a>
                          ) : (
                            <h4 className="font-semibold text-gray-900">{concert.name}</h4>
                          )}
                          {concert.description && (
                            <p className="text-sm text-gray-600 mt-1">{concert.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                            {concert.date && (
                              <span className="flex items-center gap-1">
                                📅 {new Date(concert.date).toLocaleDateString()}
                              </span>
                            )}
                            {concert.location && (
                              <span className="flex items-center gap-1">
                                📍 {concert.location}
                              </span>
                            )}
                            {concert.venue && (
                              <span className="flex items-center gap-1">
                                🎪 {concert.venue}
                              </span>
                            )}
                            {concert.link && (
                              <span className="flex items-center gap-1">
                                🔗 <a href={concert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Link</a>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {concertPhotos.length} photo{concertPhotos.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setName(concert.name || '');
                            setDescription(concert.description || '');
                            setDate(concert.date || '');
                            setLocation(concert.location || '');
                            setVenue(concert.venue || '');
                            setLink(concert.link || '');
                            // Note: The parent component should handle setting editingConcert
                            // This is a workaround - ideally we'd pass a callback
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PhotographyManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  const [draggedPhoto, setDraggedPhoto] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [assigningCategory, setAssigningCategory] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(new Map()); // Map of photoId -> {category, featured, etc}
  const [isSaving, setIsSaving] = useState(false);
  const [sortBy, setSortBy] = useState('order'); // 'order', 'newest', 'oldest'
  const [concerts, setConcerts] = useState([]); // Array of {id, name, description, photoIds: []}
  const [expandedConcerts, setExpandedConcerts] = useState(new Set()); // Set of expanded concert IDs
  const [showConcertManager, setShowConcertManager] = useState(false);
  const [editingConcert, setEditingConcert] = useState(null);

  // Categories including "all"
  const categories = [
    { id: 'all', name: 'All Photos' },
    ...Object.values(photoCategories)
  ];

  useEffect(() => {
    checkApiConnection();
    if (apiAvailable) {
      fetchPhotos();
    }
  }, [apiAvailable, selectedCategory]);

  useEffect(() => {
    loadConcerts();
    filterPhotos();
  }, [photos, searchTerm, selectedCategory, sortBy]);

  // Load concerts from localStorage
  const loadConcerts = () => {
    try {
      const stored = localStorage.getItem('concerts');
      if (stored) {
        setConcerts(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load concerts:', e);
    }
  };

  // Save concerts to localStorage
  const saveConcerts = (newConcerts) => {
    try {
      localStorage.setItem('concerts', JSON.stringify(newConcerts));
      setConcerts(newConcerts);
    } catch (e) {
      console.warn('Could not save concerts:', e);
    }
  };

  // Keyboard navigation for preview modal
  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        const newIndex = previewIndex > 0 ? previewIndex - 1 : filteredPhotos.length - 1;
        const newPhoto = filteredPhotos[newIndex];
        setPreviewIndex(newIndex);
        // Get the latest photo data from the photos array
        const latestPhoto = photos.find(p => p.id === newPhoto.id) || newPhoto;
        setSelectedPhoto(latestPhoto);
      } else if (e.key === 'ArrowRight') {
        const newIndex = previewIndex < filteredPhotos.length - 1 ? previewIndex + 1 : 0;
        const newPhoto = filteredPhotos[newIndex];
        setPreviewIndex(newIndex);
        // Get the latest photo data from the photos array
        const latestPhoto = photos.find(p => p.id === newPhoto.id) || newPhoto;
        setSelectedPhoto(latestPhoto);
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, previewIndex, filteredPhotos, photos]);

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

  // Helper functions for localStorage persistence
  const getStoredCategoryAssignments = () => {
    try {
      const stored = localStorage.getItem('photoCategoryAssignments');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveCategoryAssignment = (filename, category) => {
    try {
      const assignments = getStoredCategoryAssignments();
      if (category && category !== 'uploads' && category !== 'uncategorized') {
        assignments[filename] = category;
      } else {
        delete assignments[filename];
      }
      localStorage.setItem('photoCategoryAssignments', JSON.stringify(assignments));
    } catch (e) {
      console.warn('Could not save category assignment to localStorage:', e);
    }
  };

  const getStoredVisibilityAssignments = () => {
    try {
      const stored = localStorage.getItem('photoVisibilityAssignments');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveVisibilityAssignment = (filename, visible) => {
    try {
      const assignments = getStoredVisibilityAssignments();
      if (visible) {
        assignments[filename] = true;
      } else {
        delete assignments[filename];
      }
      localStorage.setItem('photoVisibilityAssignments', JSON.stringify(assignments));
    } catch (e) {
      console.warn('Could not save visibility assignment to localStorage:', e);
    }
  };

  const fetchPhotos = async () => {
    if (!apiAvailable) return;
    
    try {
      setLoading(true);
      console.log('Fetching photos from API...');
      
      // Get stored assignments from localStorage
      const storedCategories = getStoredCategoryAssignments();
      const storedVisibility = getStoredVisibilityAssignments();
      
      // Generate a single cache-busting timestamp for this fetch
      // This ensures all photos from the same fetch use the same timestamp
      const cacheBuster = `?t=${Date.now()}`;
      
      // Fetch all images from database
      const response = await fetch(`${API_BASE_URL}/api/images?limit=10000`);
      const data = await response.json();
      
      let allPhotos = (data.images || []).map(img => {
        // Determine image path
        let imageSrc = '';
        let thumbnailSrc = '';
        
        // Add cache-busting query parameter to force browser to fetch fresh images
        if (img.folder?.path) {
          const folderPath = img.folder.path.replace('/photos/', '');
          imageSrc = `${API_BASE_URL}/images/${folderPath}/${img.filename}${cacheBuster}`;
        } else {
          imageSrc = `${API_BASE_URL}/images/uploads/${img.filename}${cacheBuster}`;
        }
        thumbnailSrc = `${API_BASE_URL}/images/thumbnails/${img.filename}${cacheBuster}`;
        
        // Get concert assignment from localStorage or tags
        const getConcertId = () => {
          try {
            const concertAssignments = localStorage.getItem('photoConcertAssignments');
            if (concertAssignments) {
              const assignments = JSON.parse(concertAssignments);
              return assignments[img.filename] || assignments[img.id] || null;
            }
          } catch (e) {
            // Ignore
          }
          return null;
        };

        return {
          id: img.id,
          filename: img.filename,
          title: img.title || img.filename,
          description: img.description || '',
          category: img.category || 'general',
          featured: img.featured || false,
          visible: img.featured || false, // Use featured field for visibility
          order: img.order || 0,
          date: img.date || '',
          location: img.location || '',
          lens: img.lens || '',
          imageSrc,
          thumbnailSrc,
          source: 'database',
          concertId: getConcertId(),
          createdAt: img.createdAt || img.date || new Date().toISOString()
        };
      });
      
      console.log('Photos from database:', allPhotos.length);
      
      // Also fetch filesystem photos (photos that exist on disk but may not be in DB)
      try {
        const fsResponse = await fetch(`${API_BASE_URL}/api/images/filesystem`);
        if (fsResponse.ok) {
          const fsData = await fsResponse.json();
          console.log('Filesystem photos found:', fsData.found || 0);
          console.log('Photos NOT in database:', fsData.notInDatabase || 0);
          
          // Add filesystem-only photos (those not in database)
          if (fsData.files && Array.isArray(fsData.files)) {
            const filesystemPhotos = fsData.files
              .filter(file => !file.inDatabase && file.source === 'filesystem')
              .map(file => {
                // Check localStorage for stored category and visibility
                const storedCategory = storedCategories[file.filename];
                const storedVisible = storedVisibility[file.filename];
                
                // Get concert assignment
                const getConcertId = () => {
                  try {
                    const concertAssignments = localStorage.getItem('photoConcertAssignments');
                    if (concertAssignments) {
                      const assignments = JSON.parse(concertAssignments);
                      return assignments[file.filename] || null;
                    }
                  } catch (e) {
                    // Ignore
                  }
                  return null;
                };

                return {
                  id: `fs-${file.filename}`,
                  filename: file.filename,
                  title: file.filename.replace(/\.[^/.]+$/, ''), // Remove extension
                  description: 'Photo from filesystem (not yet in database)',
                  category: storedCategory || 'uploads', // Use stored category if available
                  featured: storedVisible || false,
                  visible: storedVisible || false,
                  order: 0,
                  date: file.modified ? new Date(file.modified).toISOString().split('T')[0] : '',
                  location: '',
                  lens: '',
                  // Add cache-busting query parameter (use the same timestamp from fetch)
                  imageSrc: `${API_BASE_URL}${file.url}${cacheBuster}`,
                  thumbnailSrc: file.thumbnail ? `${API_BASE_URL}${file.thumbnail}${cacheBuster}` : `${API_BASE_URL}${file.url}${cacheBuster}`,
                  source: 'filesystem',
                  concertId: getConcertId(),
                  createdAt: file.modified || new Date().toISOString()
                };
              });
            
            console.log('Filesystem-only photos to add:', filesystemPhotos.length);
            allPhotos = [...allPhotos, ...filesystemPhotos];
          }
        }
      } catch (fsError) {
        console.warn('Could not fetch filesystem photos:', fsError);
        // Non-critical, continue
      }
      
      // Sort by order, then by createdAt
      allPhotos.sort((a, b) => {
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      });
      
      console.log('Total photos after adding filesystem photos:', allPhotos.length);
      
      setPhotos(allPhotos);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError('Failed to fetch photos. Make sure the API server is running.');
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const filterPhotos = () => {
    let filtered = [...photos];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(photo => photo.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(photo =>
        photo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort photos
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateB - dateA; // Newest first
      } else if (sortBy === 'oldest') {
        const dateA = new Date(a.createdAt || a.date || 0);
        const dateB = new Date(b.createdAt || b.date || 0);
        return dateA - dateB; // Oldest first
      } else {
        // Default: sort by order, then by createdAt
        if (a.order !== b.order) {
          return (a.order || 0) - (b.order || 0);
        }
        return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      }
    });

    setFilteredPhotos(filtered);
  };

  const handleUploadComplete = async (uploadedImages) => {
    // Refresh the photos list to show newly uploaded photos
    console.log('Upload complete, refreshing photos list...', uploadedImages);
    await fetchPhotos();
    // Don't close the modal here - let PhotoUploader handle it
    // setShowPhotoUploader(false);
  };

  // Drag and drop handlers
  const handleDragStart = (e, photo) => {
    setDraggedPhoto(photo);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', photo.id);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedPhoto) return;

    const currentIndex = filteredPhotos.findIndex(p => p.id === draggedPhoto.id);
    if (currentIndex === dropIndex || currentIndex === -1) {
      setDraggedPhoto(null);
      return;
    }

    // Reorder photos locally
    const newPhotos = [...filteredPhotos];
    const [removed] = newPhotos.splice(currentIndex, 1);
    newPhotos.splice(dropIndex, 0, removed);

    // Update order values
    const updatedPhotos = newPhotos.map((photo, idx) => ({
      ...photo,
      order: idx
    }));

    setFilteredPhotos(updatedPhotos);
    setDraggedPhoto(null);

    // Update order in database
    try {
      await updatePhotoOrder(updatedPhotos);
    } catch (err) {
      console.error('Failed to update photo order:', err);
      // Revert on error
      fetchPhotos();
    }
  };

  const updatePhotoOrder = async (orderedPhotos) => {
    // Update each photo's order
    const updates = orderedPhotos.map((photo, index) =>
      fetch(`${API_BASE_URL}/api/images/${photo.id}/order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: index })
      })
    );

    await Promise.all(updates);
  };

  const toggleVisibility = (photoId, currentVisibility) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const newVisibility = !currentVisibility;
    
    // Update local state immediately (no API call)
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, featured: newVisibility, visible: newVisibility } : p
    ));
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, featured: newVisibility, visible: newVisibility });
    }
    
    // Track pending change
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(photoId) || {};
      newMap.set(photoId, { ...existing, featured: newVisibility, visible: newVisibility });
      return newMap;
    });
  };

  const toggleCategory = (photoId, category, isInCategory) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;
    
    const newCategory = isInCategory ? null : category;
    
    // Update local state immediately (no API call)
    setPhotos(prev => prev.map(p => 
      p.id === photoId ? { ...p, category: newCategory } : p
    ));
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, category: newCategory });
    }
    
    // Track pending change
    setPendingChanges(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(photoId) || {};
      newMap.set(photoId, { ...existing, category: newCategory });
      return newMap;
    });
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) return;
    
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
        // Clear pending changes for deleted photo
        setPendingChanges(prev => {
          const newMap = new Map(prev);
          newMap.delete(photoId);
          return newMap;
        });
        fetchPhotos();
        setSelectedPhotos(new Set());
      } else {
        // Try to parse JSON, but handle HTML 404 pages
        let errorMessage = 'Failed to delete photo';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // Response is not JSON (probably HTML 404 page)
          if (response.status === 404) {
            errorMessage = 'Delete endpoint not found. Please restart the API server (npm run api)';
          } else {
            errorMessage = `Server error (${response.status}). Please check the API server.`;
          }
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
      setError(`Failed to delete photo: ${err.message}`);
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

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Delete photos in parallel
    const deletePromises = selectedArray.map(async (photoId) => {
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
          const photo = photos.find(p => p.id === photoId);
          errors.push(photo?.filename || photoId);
        }
      } catch (err) {
        errorCount++;
        const photo = photos.find(p => p.id === photoId);
        errors.push(photo?.filename || photoId);
        console.error(`Failed to delete ${photoId}:`, err);
      }
    });

    await Promise.all(deletePromises);

    setDeleting(false);
    setSelectedPhotos(new Set());

    if (successCount > 0) {
      // Clear pending changes for deleted photos
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        selectedArray.forEach(photoId => newMap.delete(photoId));
        return newMap;
      });
      fetchPhotos();
    }

    if (errorCount > 0) {
      setError(`Failed to delete ${errorCount} photo(s). ${successCount} deleted successfully.`);
    } else if (successCount > 0) {
      setError(null);
    }
  };

  const assignCategoryToSelected = (categoryId) => {
    const selectedArray = Array.from(selectedPhotos);
    if (selectedArray.length === 0) return;

    const newCategory = categoryId === 'none' ? null : categoryId;

    // Update local state immediately for all selected photos
    selectedArray.forEach(photoId => {
      setPhotos(prev => prev.map(p => 
        p.id === photoId ? { ...p, category: newCategory } : p
      ));
      
      // Track pending change
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(photoId) || {};
        newMap.set(photoId, { ...existing, category: newCategory });
        return newMap;
      });
    });

    setSelectedPhotos(new Set());
  };

  const togglePhotoSelection = (photoId, index = null, event = null) => {
    const newSelected = new Set(selectedPhotos);
    const isCtrlClick = event?.ctrlKey || event?.metaKey; // Support both Ctrl (Windows/Linux) and Cmd (Mac)
    const isShiftClick = event?.shiftKey;
    
    if (isShiftClick && lastSelectedIndex !== null && index !== null) {
      // Shift+Click: Select range from last selected to current
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangePhotos = filteredPhotos.slice(start, end + 1);
      
      rangePhotos.forEach(photo => {
        newSelected.add(photo.id);
      });
      
      setLastSelectedIndex(index);
    } else if (isCtrlClick) {
      // Ctrl/Cmd+Click: Toggle individual selection
      if (newSelected.has(photoId)) {
        newSelected.delete(photoId);
      } else {
        newSelected.add(photoId);
      }
      if (index !== null) {
        setLastSelectedIndex(index);
      }
    } else {
      // Regular click: Toggle individual selection (existing behavior)
      if (newSelected.has(photoId)) {
        newSelected.delete(photoId);
      } else {
        newSelected.add(photoId);
      }
      if (index !== null) {
        setLastSelectedIndex(index);
      }
    }
    
    setSelectedPhotos(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set());
      setLastSelectedIndex(null);
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(p => p.id)));
      setLastSelectedIndex(filteredPhotos.length - 1);
    }
  };

  // Concert management functions
  const createConcert = (concertData) => {
    const newConcert = {
      id: `concert-${Date.now()}`,
      name: concertData.name,
      description: concertData.description || '',
      date: concertData.date || '',
      location: concertData.location || '',
      venue: concertData.venue || '',
      link: concertData.link || '',
      photoIds: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...concerts, newConcert];
    saveConcerts(updated);
    return newConcert;
  };

  const updateConcert = (id, concertData) => {
    const updated = concerts.map(c => 
      c.id === id ? { 
        ...c, 
        name: concertData.name,
        description: concertData.description || '',
        date: concertData.date || '',
        location: concertData.location || '',
        venue: concertData.venue || '',
        link: concertData.link || ''
      } : c
    );
    saveConcerts(updated);
  };

  const deleteConcert = (id) => {
    const updated = concerts.filter(c => c.id !== id);
    saveConcerts(updated);
    // Remove concert assignment from photos
    setPhotos(prev => prev.map(p => {
      if (p.concertId === id) {
        const { concertId, ...rest } = p;
        return rest;
      }
      return p;
    }));
  };

  const assignPhotosToConcert = (photoIds, concertId) => {
    // Update photos with concertId
    setPhotos(prev => prev.map(p => 
      photoIds.includes(p.id) ? { ...p, concertId } : p
    ));
    
    // Save concert assignments to localStorage
    try {
      const assignments = JSON.parse(localStorage.getItem('photoConcertAssignments') || '{}');
      photoIds.forEach(photoId => {
        const photo = photos.find(p => p.id === photoId);
        if (photo) {
          assignments[photo.filename] = concertId;
          assignments[photo.id] = concertId;
        }
      });
      localStorage.setItem('photoConcertAssignments', JSON.stringify(assignments));
    } catch (e) {
      console.warn('Could not save concert assignments:', e);
    }
    
    // Update concert's photoIds
    const updated = concerts.map(c => {
      if (c.id === concertId) {
        const newPhotoIds = [...new Set([...c.photoIds, ...photoIds])];
        return { ...c, photoIds: newPhotoIds };
      }
      return c;
    });
    saveConcerts(updated);
    
    // Track pending changes
    photoIds.forEach(photoId => {
      setPendingChanges(prev => {
        const newMap = new Map(prev);
        const existing = newMap.get(photoId) || {};
        newMap.set(photoId, { ...existing, concertId });
        return newMap;
      });
    });
  };

  const removePhotoFromConcert = (photoId, concertId) => {
    const photo = photos.find(p => p.id === photoId);
    
    setPhotos(prev => prev.map(p => {
      if (p.id === photoId && p.concertId === concertId) {
        const { concertId, ...rest } = p;
        return rest;
      }
      return p;
    }));
    
    // Remove from localStorage
    try {
      const assignments = JSON.parse(localStorage.getItem('photoConcertAssignments') || '{}');
      if (photo) {
        delete assignments[photo.filename];
        delete assignments[photo.id];
      }
      localStorage.setItem('photoConcertAssignments', JSON.stringify(assignments));
    } catch (e) {
      console.warn('Could not remove concert assignment:', e);
    }
    
    const updated = concerts.map(c => {
      if (c.id === concertId) {
        return { ...c, photoIds: c.photoIds.filter(id => id !== photoId) };
      }
      return c;
    });
    saveConcerts(updated);
  };

  const toggleConcertExpanded = (concertId) => {
    setExpandedConcerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(concertId)) {
        newSet.delete(concertId);
      } else {
        newSet.add(concertId);
      }
      return newSet;
    });
  };

  // Get photos grouped by concert
  const getConcertGroupedPhotos = () => {
    const concertMap = new Map();
    
    // Initialize concerts
    concerts.forEach(concert => {
      concertMap.set(concert.id, {
        ...concert,
        photos: []
      });
    });
    
    // Add ungrouped photos
    concertMap.set('ungrouped', {
      id: 'ungrouped',
      name: 'Ungrouped Concert Photos',
      description: 'Photos not yet assigned to a specific concert',
      photos: []
    });
    
    // Group photos
    filteredPhotos.forEach(photo => {
      if (photo.concertId && concertMap.has(photo.concertId)) {
        concertMap.get(photo.concertId).photos.push(photo);
      } else {
        concertMap.get('ungrouped').photos.push(photo);
      }
    });
    
    // Filter out empty ungrouped if there are other concerts
    const result = Array.from(concertMap.values()).filter(c => 
      c.id !== 'ungrouped' || c.photos.length > 0 || concerts.length === 0
    );
    
    return result;
  };

  const savePendingChanges = async () => {
    if (pendingChanges.size === 0) {
      setError('No changes to save');
      return;
    }

    if (!apiAvailable) {
      setError('API server is not available');
      return;
    }

    setIsSaving(true);
    setError(null);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    // Process all pending changes
    const updatePromises = Array.from(pendingChanges.entries()).map(async ([photoId, changes]) => {
      try {
        const photo = photos.find(p => p.id === photoId);
        if (!photo) return;

        // For filesystem photos, create database record first if needed
        if (photo.source === 'filesystem') {
          // Save to localStorage immediately
          if (changes.category !== undefined) {
            saveCategoryAssignment(photo.filename, changes.category);
          }
          if (changes.featured !== undefined) {
            saveVisibilityAssignment(photo.filename, changes.featured);
          }

          // Try to create/update database record
          try {
            const createResponse = await fetch(`${API_BASE_URL}/api/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                filename: photo.filename,
                title: photo.title,
                description: photo.description || '',
                category: changes.category !== undefined ? changes.category : photo.category,
                featured: changes.featured !== undefined ? changes.featured : photo.featured
              })
            });
            
            if (createResponse.ok) {
              successCount++;
            } else {
              errorCount++;
              errors.push(photo.filename);
            }
          } catch (createError) {
            // localStorage already saved, so this is non-critical
            console.warn(`Database record creation failed for ${photo.filename} (stored in localStorage):`, createError);
            successCount++; // Count as success since localStorage has it
          }
        } else {
          // Regular database photo - update fields
          const updates = {};
          if (changes.category !== undefined) {
            updates.category = changes.category;
          }
          if (changes.featured !== undefined) {
            // Use the feature endpoint for visibility
            const featureResponse = await fetch(`${API_BASE_URL}/api/images/${photoId}/feature`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ featured: changes.featured })
            });
            
            if (!featureResponse.ok) {
              errorCount++;
              errors.push(photo.filename);
              return;
            }
          }
          
          if (Object.keys(updates).length > 0 && updates.category !== undefined) {
            const response = await fetch(`${API_BASE_URL}/api/images/${photoId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updates)
            });

            if (response.ok) {
              successCount++;
            } else {
              errorCount++;
              errors.push(photo.filename);
            }
          } else if (changes.featured !== undefined) {
            successCount++;
          }
        }
      } catch (err) {
        errorCount++;
        errors.push(photo.filename);
        console.error(`Failed to save changes for ${photoId}:`, err);
      }
    });

    await Promise.all(updatePromises);

    setIsSaving(false);

    if (successCount > 0) {
      // Clear pending changes and refresh
      setPendingChanges(new Map());
      await fetchPhotos();
    }

    if (errorCount > 0) {
      setError(`Failed to save ${errorCount} photo(s). ${successCount} saved successfully.`);
    } else {
      setError(null);
    }
  };

  if (loading && apiAvailable) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Calculate photo status counts
  const photoStatusCounts = {
    ready: photos.filter(p => p.featured && p.category && p.category !== 'uploads' && p.category !== 'uncategorized').length,
    needsCategory: photos.filter(p => p.featured && (!p.category || p.category === 'uploads' || p.category === 'uncategorized')).length,
    needsVisibility: photos.filter(p => !p.featured && (p.category && p.category !== 'uploads' && p.category !== 'uncategorized')).length,
    unassigned: photos.filter(p => !p.featured && (!p.category || p.category === 'uploads' || p.category === 'uncategorized')).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Photography Manager</h2>
          <p className="text-gray-600 mt-1">Upload, organize, and publish your photography portfolio</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingChanges.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">
                {pendingChanges.size} unsaved change{pendingChanges.size > 1 ? 's' : ''}
              </span>
            </div>
          )}
          <button
            onClick={savePendingChanges}
            disabled={pendingChanges.size === 0 || isSaving || !apiAvailable}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FaCheck className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
          <button
            onClick={() => setShowPhotoUploader(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl text-lg font-medium"
          >
            <FaUpload className="w-5 h-5" />
            Upload Photos
          </button>
        </div>
      </div>

      {/* Quick Stats & Workflow Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo Status Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-700 font-medium mb-1">Ready to Publish</div>
            <div className="text-2xl font-bold text-green-900">{photoStatusCounts.ready}</div>
            <div className="text-xs text-green-600 mt-1">Has category & visible</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-700 font-medium mb-1">Needs Category</div>
            <div className="text-2xl font-bold text-yellow-900">{photoStatusCounts.needsCategory}</div>
            <div className="text-xs text-yellow-600 mt-1">Visible but no category</div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-700 font-medium mb-1">Needs Visibility</div>
            <div className="text-2xl font-bold text-orange-900">{photoStatusCounts.needsVisibility}</div>
            <div className="text-xs text-orange-600 mt-1">Has category, not visible</div>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-700 font-medium mb-1">Unassigned</div>
            <div className="text-2xl font-bold text-gray-900">{photoStatusCounts.unassigned}</div>
            <div className="text-xs text-gray-600 mt-1">No category, not visible</div>
          </div>
        </div>

        {/* Quick Guide */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FaCheck className="w-4 h-4" />
            Quick Guide
          </h3>
          <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
            <li><strong>Upload</strong> photos using the button above</li>
            <li><strong>Click</strong> a photo to preview and edit</li>
            <li><strong>Ctrl/Cmd+Click</strong> to select multiple photos</li>
            <li><strong>Shift+Click</strong> to select a range of photos</li>
            <li><strong>Assign</strong> categories and toggle visibility</li>
            <li><strong>Click "Save Changes"</strong> to apply all updates at once</li>
            <li>Photos appear on your site when they have category & visibility!</li>
          </ol>
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

      {/* Category Filter and Sort */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!apiAvailable}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <FaSort className="text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!apiAvailable}
          >
            <option value="order">By Order</option>
            <option value="newest">Most Recently Added</option>
            <option value="oldest">Oldest Added</option>
          </select>
        </div>
        {selectedCategory === 'concerts' && (
          <button
            onClick={() => setShowConcertManager(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaMusic className="w-4 h-4" />
            Manage Concerts
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600">Total Photos</p>
            <p className="text-2xl font-bold text-blue-900">{photos.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Showing</p>
            <p className="text-2xl font-bold text-blue-900">{filteredPhotos.length}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Visible on Site</p>
            <p className="text-2xl font-bold text-blue-900">
              {photos.filter(p => p.featured).length}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      {filteredPhotos.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-wrap">
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
              <>
                <span className="text-sm text-gray-600">
                  {selectedPhotos.size} photo(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <FaEye className="w-4 h-4 text-gray-500" />
                  <button
                    onClick={() => {
                      const selectedArray = Array.from(selectedPhotos);
                      const allVisible = selectedArray.every(id => {
                        const photo = photos.find(p => p.id === id);
                        return photo?.featured || false;
                      });
                      // Toggle visibility for all selected photos
                      selectedArray.forEach(photoId => {
                        const photo = photos.find(p => p.id === photoId);
                        if (photo) {
                          toggleVisibility(photoId, photo.featured || false);
                        }
                      });
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors bg-white"
                    title="Toggle visibility for all selected photos"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>Toggle Visibility</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <FaTag className="w-4 h-4 text-gray-500" />
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        assignCategoryToSelected(e.target.value);
                        e.target.value = ''; // Reset dropdown
                      }
                    }}
                    disabled={assigningCategory || !apiAvailable}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    defaultValue=""
                  >
                    <option value="">Assign Category...</option>
                    <option value="none">Remove Category</option>
                    {Object.entries(photoCategories).map(([id, cat]) => (
                      <option key={id} value={id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCategory === 'concerts' && concerts.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FaMusic className="w-4 h-4 text-gray-500" />
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          assignPhotosToConcert(Array.from(selectedPhotos), e.target.value);
                          e.target.value = ''; // Reset dropdown
                          setSelectedPhotos(new Set());
                        }
                      }}
                      disabled={!apiAvailable}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      defaultValue=""
                    >
                      <option value="">Assign to Concert...</option>
                      {concerts.map(concert => (
                        <option key={concert.id} value={concert.id}>
                          {concert.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
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

      {/* Photos Grid - Show concerts in collapsible format if concerts category */}
      {selectedCategory === 'concerts' ? (
        <div className="space-y-4">
          {getConcertGroupedPhotos().map((concert) => {
            const isExpanded = expandedConcerts.has(concert.id);
            const displayPhotos = isExpanded ? concert.photos : concert.photos.slice(0, 4);
            const hasMore = concert.photos.length > 4;
            
            return (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden"
              >
                {/* Concert Header */}
                <div 
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors"
                  onClick={() => toggleConcertExpanded(concert.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <FaMusic className="w-5 h-5 text-purple-600" />
                        {concert.link ? (
                          <a
                            href={concert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors"
                          >
                            {concert.name}
                          </a>
                        ) : (
                          <h3 className="text-lg font-bold text-gray-900">{concert.name}</h3>
                        )}
                        <span className="text-sm text-gray-500">
                          ({concert.photos.length} photo{concert.photos.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                      {isExpanded && (
                        <div className="mt-2 ml-8 space-y-1">
                          {concert.description && (
                            <p className="text-sm text-gray-600">{concert.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
                            {concert.date && (
                              <span className="flex items-center gap-1">
                                📅 {new Date(concert.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            )}
                            {concert.location && (
                              <span className="flex items-center gap-1">
                                📍 {concert.location}
                              </span>
                            )}
                            {concert.venue && (
                              <span className="flex items-center gap-1">
                                🎪 {concert.venue}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {concert.id !== 'ungrouped' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingConcert(concert);
                            setShowConcertManager(true);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit concert"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                      )}
                      {isExpanded ? (
                        <FaChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FaChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Concert Photos */}
                {displayPhotos.length > 0 && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {displayPhotos.map((photo, index) => (
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
                          onClick={(e) => {
                            const photoIndex = filteredPhotos.findIndex(p => p.id === photo.id);
                            const isCtrlClick = e.ctrlKey || e.metaKey;
                            const isShiftClick = e.shiftKey;
                            
                            if (isCtrlClick || isShiftClick) {
                              e.stopPropagation();
                              togglePhotoSelection(photo.id, photoIndex, e);
                            } else {
                              setPreviewIndex(photoIndex);
                              setSelectedPhoto(photo);
                            }
                          }}
                        >
                          {/* Selection Checkbox */}
                          <div 
                            className="absolute top-2 left-2 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              const photoIndex = filteredPhotos.findIndex(p => p.id === photo.id);
                              togglePhotoSelection(photo.id, photoIndex, e);
                            }}
                          >
                            <button
                              className={`p-1 rounded bg-white shadow-md hover:bg-gray-100 transition-colors ${
                                selectedPhotos.has(photo.id) ? 'text-blue-600' : 'text-gray-400'
                              }`}
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
                              src={photo.thumbnailSrc || photo.imageSrc}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = photo.imageSrc;
                                e.target.onerror = () => {
                                  e.target.style.display = 'none';
                                };
                              }}
                            />
                          </div>
                          
                          <div className="p-2">
                            <p className="text-xs font-medium text-gray-900 truncate" title={photo.title}>
                              {photo.title}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {!isExpanded && hasMore && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => toggleConcertExpanded(concert.id)}
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Show {concert.photos.length - 4} more photos...
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {displayPhotos.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <FaImages className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No photos in this concert yet</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
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
            onClick={(e) => {
              const index = filteredPhotos.findIndex(p => p.id === photo.id);
              const isCtrlClick = e.ctrlKey || e.metaKey;
              const isShiftClick = e.shiftKey;
              
              // If Ctrl/Cmd or Shift is held, handle selection instead of opening preview
              if (isCtrlClick || isShiftClick) {
                e.stopPropagation();
                togglePhotoSelection(photo.id, index, e);
              } else {
                // Regular click: open preview
                setPreviewIndex(index);
                setSelectedPhoto(photo);
              }
            }}
          >
            {/* Selection Checkbox */}
            <div 
              className="absolute top-2 left-2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                const index = filteredPhotos.findIndex(p => p.id === photo.id);
                togglePhotoSelection(photo.id, index, e);
              }}
            >
              <button
                className={`p-1 rounded bg-white shadow-md hover:bg-gray-100 transition-colors ${
                  selectedPhotos.has(photo.id) ? 'text-blue-600' : 'text-gray-400'
                }`}
                title={selectedPhotos.has(photo.id) ? 'Deselect (Ctrl/Cmd+Click for multi-select)' : 'Select (Ctrl/Cmd+Click for multi-select)'}
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
                src={photo.thumbnailSrc || photo.imageSrc}
                alt={photo.title}
                className="w-full h-full object-cover"
                loading={index < 20 ? "eager" : "lazy"}
                onError={(e) => {
                  e.target.src = photo.imageSrc;
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
              
              {/* Status Indicator - Top Left */}
              {(() => {
                const hasCategory = photo.category && photo.category !== 'uploads' && photo.category !== 'uncategorized';
                const isVisible = photo.featured;
                if (hasCategory && isVisible) {
                  return <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md" title="Ready to publish"></div>;
                } else if (hasCategory && !isVisible) {
                  return <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-md" title="Needs visibility"></div>;
                } else if (!hasCategory && isVisible) {
                  return <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-md" title="Needs category"></div>;
                } else {
                  return <div className="absolute top-2 right-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-md" title="Unassigned"></div>;
                }
              })()}
              
              {/* Category Badge - Top Right */}
              {photo.category && photo.category !== 'uploads' && photo.category !== 'uncategorized' && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium shadow-md">
                  {photoCategories[photo.category]?.name || photo.category}
                </div>
              )}
              
              {/* Visibility Badge - Bottom Right */}
              {photo.featured && (
                <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium shadow-md flex items-center gap-1">
                  <FaEye className="w-3 h-3" />
                  Visible
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVisibility(photo.id, photo.visible);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    photo.visible
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                  title={photo.visible ? 'Hide from website' : 'Show on website'}
                >
                  {photo.visible ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.id);
                  }}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Delete photo"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Photo Info */}
            <div className="p-2 space-y-1">
              <p className="text-xs font-medium text-gray-900 truncate" title={photo.title}>
                {photo.title}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {photo.category && photo.category !== 'uploads' && photo.category !== 'uncategorized' ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                    <FaTag className="w-2.5 h-2.5" />
                    {photoCategories[photo.category]?.name || photo.category}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 italic">No category</span>
                )}
                {!photo.featured && (
                  <span className="text-xs text-gray-400 italic">• Hidden</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPhotos.length === 0 && !loading && (
        <div className="text-center py-12">
          <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter terms.' 
              : 'Upload your first photos to get started.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowPhotoUploader(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Upload Photos
            </button>
          )}
        </div>
      )}

      {/* Concert Manager Modal */}
      {showConcertManager && (
        <ConcertManagerModal
          concerts={concerts}
          editingConcert={editingConcert}
          photos={filteredPhotos}
          selectedPhotos={selectedPhotos}
          onClose={() => {
            setShowConcertManager(false);
            setEditingConcert(null);
          }}
          onCreateConcert={createConcert}
          onUpdateConcert={updateConcert}
          onDeleteConcert={deleteConcert}
          onAssignPhotos={assignPhotosToConcert}
          onRemovePhoto={removePhotoFromConcert}
        />
      )}

      {/* Photo Uploader Modal */}
      {showPhotoUploader && (
        <PhotoUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowPhotoUploader(false)}
        />
      )}

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-6xl max-h-[95vh] overflow-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const newIndex = previewIndex > 0 ? previewIndex - 1 : filteredPhotos.length - 1;
                    const newPhoto = filteredPhotos[newIndex];
                    setPreviewIndex(newIndex);
                    // Get the latest photo data from the photos array
                    const latestPhoto = photos.find(p => p.id === newPhoto.id) || newPhoto;
                    setSelectedPhoto(latestPhoto);
                  }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Previous photo"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  {previewIndex + 1} of {filteredPhotos.length}
                </span>
                <button
                  onClick={() => {
                    const newIndex = previewIndex < filteredPhotos.length - 1 ? previewIndex + 1 : 0;
                    const newPhoto = filteredPhotos[newIndex];
                    setPreviewIndex(newIndex);
                    // Get the latest photo data from the photos array
                    const latestPhoto = photos.find(p => p.id === newPhoto.id) || newPhoto;
                    setSelectedPhoto(latestPhoto);
                  }}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Next photo"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePhotoSelection(selectedPhoto.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedPhotos.has(selectedPhoto.id)
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPhotos.has(selectedPhoto.id) ? (
                    <FaCheckSquare className="w-5 h-5" />
                  ) : (
                    <FaSquare className="w-5 h-5" />
                  )}
                  <span className="text-sm">
                    {selectedPhotos.has(selectedPhoto.id) ? 'Selected' : 'Select'}
                  </span>
                </button>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="p-6">
              <img
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.title}
                className="w-full h-auto rounded-lg mb-4 max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  e.target.src = selectedPhoto.thumbnailSrc || selectedPhoto.imageSrc;
                }}
              />
              
              {/* Photo Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedPhoto.title}</h3>
                  <p className="text-sm text-gray-500">{selectedPhoto.filename}</p>
                </div>
                
                {selectedPhoto.description && (
                  <p className="text-gray-700">{selectedPhoto.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {photoCategories[selectedPhoto.category]?.name || selectedPhoto.category}
                    </span>
                  )}
                  {selectedPhoto.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      Visible on Site
                    </span>
                  )}
                  {selectedPhoto.source === 'filesystem' && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      Filesystem
                    </span>
                  )}
                </div>

                {/* Category Assignment */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaTag className="w-4 h-4" />
                    Assign to Categories:
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(photoCategories).map(([id, cat]) => {
                      const isInCategory = selectedPhoto.category === id;
                      return (
                        <label 
                          key={id} 
                          className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isInCategory}
                            onChange={() => toggleCategory(selectedPhoto.id, id, isInCategory)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 flex-1">{cat.name}</span>
                          {isInCategory && (
                            <FaCheck className="w-4 h-4 text-blue-600" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Photos can only be in one category at a time. Selecting a new category will replace the current one.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleVisibility(selectedPhoto.id, selectedPhoto.visible)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedPhoto.visible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPhoto.visible ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                    <span>{selectedPhoto.visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                  <button
                    onClick={() => deletePhoto(selectedPhoto.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotographyManager;

