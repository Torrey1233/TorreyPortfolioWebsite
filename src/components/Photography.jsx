import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaTimes, FaChevronLeft, FaChevronRight, FaMusic, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import LazyImage from './LazyImage';
import EmailSubscription from './EmailSubscription';
import { photoCategories } from '../data/photography-data.js';

const Photography = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGear, setShowGear] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [imageZoom, setImageZoom] = useState(1);
  const [concerts, setConcerts] = useState([]);
  const [expandedConcerts, setExpandedConcerts] = useState(new Set());

  // Helper to get stored assignments from localStorage
  const getStoredCategoryAssignments = () => {
    try {
      const stored = localStorage.getItem('photoCategoryAssignments');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
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

  // Fetch photos from API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        // Try to fetch from API in development
        const isDevelopment = import.meta.env.DEV;
        if (isDevelopment) {
          try {
            const response = await fetch('http://localhost:3001/api/images?limit=10000');
            if (response.ok) {
              const data = await response.json();
              const storedCategories = getStoredCategoryAssignments();
              const storedVisibility = getStoredVisibilityAssignments();
              
              // Convert database images to gallery format
              const convertedPhotos = (data.images || [])
                .filter(img => img.featured === true) // Only show featured photos
                .map(img => {
                  // Determine image path
                  let imageSrc = '';
                  let thumbnailSrc = '';
                  
                  if (img.folder?.path) {
                    const folderPath = img.folder.path.replace('/photos/', '');
                    imageSrc = `/images/${folderPath}/${img.filename}`;
                    thumbnailSrc = `/images/thumbnails/${img.filename}`;
                  } else {
                    imageSrc = `/images/uploads/${img.filename}`;
                    thumbnailSrc = `/images/thumbnails/${img.filename}`;
                  }
                  
                  // Get concert assignment from localStorage
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
                    src: imageSrc,
                    thumbnail: thumbnailSrc,
                    alt: img.title || img.filename || 'Photo',
                    category: img.category || 'general',
                    title: img.title || img.filename,
                    description: img.description || '',
                    date: img.date || '',
                    lens: img.lens || '',
                    location: img.location || '',
                    order: img.order || 0,
                    concertId: getConcertId()
                  };
                })
                .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order
              
              // Also fetch filesystem photos that are visible and have categories
              try {
                const fsResponse = await fetch('http://localhost:3001/api/images/filesystem');
                if (fsResponse.ok) {
                  const fsData = await fsResponse.json();
                  if (fsData.files && Array.isArray(fsData.files)) {
                    const filesystemPhotos = fsData.files
                      .filter(file => {
                        // Only include filesystem photos that are:
                        // 1. Not in database, AND
                        // 2. Have a category assigned in localStorage, AND
                        // 3. Are marked as visible in localStorage
                        return !file.inDatabase && 
                               storedCategories[file.filename] && 
                               storedVisibility[file.filename];
                      })
                      .map(file => {
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
                          src: file.url,
                          thumbnail: file.thumbnail || file.url,
                          alt: file.filename.replace(/\.[^/.]+$/, ''),
                          category: storedCategories[file.filename],
                          title: file.filename.replace(/\.[^/.]+$/, ''),
                          description: '',
                          date: file.modified ? new Date(file.modified).toISOString().split('T')[0] : '',
                          lens: '',
                          location: '',
                          order: 0,
                          concertId: getConcertId()
                        };
                      });
                    
                    convertedPhotos.push(...filesystemPhotos);
                  }
                }
              } catch (fsError) {
                console.log('Could not fetch filesystem photos:', fsError);
              }
              
              setPhotos(convertedPhotos);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('API not available, using empty gallery');
          }
        }
        
        // If API unavailable or production, use empty array
        setPhotos([]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch photos:', err);
        setPhotos([]);
        setLoading(false);
      }
    };

    fetchPhotos();
    
    // Load concerts from localStorage
    try {
      const stored = localStorage.getItem('concerts');
      if (stored) {
        setConcerts(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load concerts:', e);
    }
  }, []);

  // Filter photos by category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'all') {
      return photos;
    }
    return photos.filter(photo => photo.category === selectedCategory);
  }, [photos, selectedCategory]);

  // Get photos grouped by concert
  const getConcertGroupedPhotos = useMemo(() => {
    if (selectedCategory !== 'concerts') return [];
    
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
      name: 'Other Concert Photos',
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
  }, [filteredPhotos, concerts, selectedCategory]);

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

  // Virtual scrolling for performance
  const visiblePhotos = filteredPhotos.slice(visibleRange.start, visibleRange.end);

  // Reset virtual scrolling when category changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: 20 });
  }, [selectedCategory]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;
      
      const currentIndex = filteredPhotos.findIndex(img => img.id === selectedImage.id);
      
      switch (event.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            event.preventDefault();
            setSelectedImage(filteredPhotos[currentIndex - 1]);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < filteredPhotos.length - 1) {
            event.preventDefault();
            setSelectedImage(filteredPhotos[currentIndex + 1]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedImage(null);
          setImageZoom(1);
          break;
        case '+':
        case '=':
          event.preventDefault();
          setImageZoom(prev => Math.min(3, prev + 0.25));
          break;
        case '-':
          event.preventDefault();
          setImageZoom(prev => Math.max(0.5, prev - 0.25));
          break;
        case '0':
          event.preventDefault();
          setImageZoom(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredPhotos]);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="section-spacing bg-primary-50">
        <div className="container-cinematic">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-display mb-6 text-primary-900">
              Photography Portfolio
            </h1>
            <p className="text-subtitle text-primary-600 max-w-3xl mx-auto">
              Capturing moments through the lens with a passion for visual storytelling. 
              From urban landscapes to intimate portraits, each image tells a unique story.
            </p>
          </motion.div>

          {/* Gear Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="card overflow-hidden">
              <button
                onClick={() => setShowGear(!showGear)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-primary-50 transition-colors duration-300"
              >
                <div>
                  <h3 className="text-headline">
                    Photography Gear
                  </h3>
                  <p className="text-body text-primary-600 mt-1">
                    Equipment used to capture these moments
                  </p>
                </div>
                <div className={`transform transition-transform duration-300 ${showGear ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showGear && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-8 pb-6 border-t border-primary-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div>
                      <h4 className="text-subtitle font-semibold text-primary-900 mb-3">Cameras</h4>
                      <ul className="space-y-2 text-primary-700">
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                          <span><strong>Sony A7 IV</strong> - Full-frame mirrorless</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                          <span><strong>Canon 80D</strong> - Reliable DSLR</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-subtitle font-semibold text-primary-900 mb-3">Lenses</h4>
                      <ul className="space-y-2 text-primary-700">
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span><strong>Sony 28-70mm F3.5</strong> - Versatile zoom</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span><strong>TTartisan 10mm F2.0</strong> - Ultra-wide</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span><strong>Canon 18-135mm F3.5</strong> - All-purpose</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span><strong>Tamron 70-300mm F4.5-6.3</strong> - Telephoto zoom</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'card text-primary-700 hover:bg-primary-100'
                }`}
              >
                All Photos
              </button>
              {Object.entries(photoCategories).map(([id, category]) => (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === id
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'card text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Photography Grid - Show concerts in collapsible format if concerts category */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-primary-600">Loading photos...</span>
            </div>
          ) : selectedCategory === 'concerts' ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-6"
            >
              {getConcertGroupedPhotos.map((concert) => {
                const isExpanded = expandedConcerts.has(concert.id);
                const displayPhotos = isExpanded ? concert.photos : concert.photos.slice(0, 4);
                const hasMore = concert.photos.length > 4;
                
                return (
                  <motion.div
                    key={concert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card overflow-hidden"
                  >
                    {/* Concert Header */}
                    <div 
                      className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-primary-200 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors"
                      onClick={() => toggleConcertExpanded(concert.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FaMusic className="w-6 h-6 text-purple-600" />
                            {concert.link ? (
                              <a
                                href={concert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-headline text-primary-900 hover:text-purple-600 transition-colors cursor-pointer"
                              >
                                {concert.name}
                              </a>
                            ) : (
                              <h3 className="text-headline text-primary-900">{concert.name}</h3>
                            )}
                            <span className="text-body text-primary-600">
                              ({concert.photos.length} photo{concert.photos.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                          {isExpanded && (
                            <div className="ml-9 space-y-2 mt-3">
                              {concert.description && (
                                <p className="text-body text-primary-700">{concert.description}</p>
                              )}
                              <div className="flex flex-wrap gap-4 text-caption text-primary-600">
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
                        <div className="ml-4">
                          {isExpanded ? (
                            <FaChevronUp className="w-5 h-5 text-primary-600" />
                          ) : (
                            <FaChevronDown className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Concert Photos */}
                    {displayPhotos.length > 0 && (
                      <div className="p-6">
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                          {displayPhotos.map((image, idx) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: idx * 0.05 }}
                              className="group cursor-pointer mb-6 break-inside-avoid"
                              onClick={() => setSelectedImage(image)}
                            >
                              <div className="card overflow-hidden">
                                <div className="relative overflow-hidden">
                                  <LazyImage
                                    src={image.thumbnail || image.src}
                                    alt={image.alt}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDMyMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTI4TDE0NCAxNDRIMTc2TDE2MCAxMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=="
                                    loading="lazy"
                                  />
                                  
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-end">
                                    <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                      <div className="flex items-center gap-4 text-xs text-gray-300">
                                        <span className="flex items-center gap-1">
                                          <FaCamera className="w-4 h-4" />
                                          {image.lens || 'Sony 28-70mm F3.5'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {!isExpanded && hasMore && (
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => toggleConcertExpanded(concert.id)}
                              className="btn btn-primary"
                            >
                              Show {concert.photos.length - 4} more photos...
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {displayPhotos.length === 0 && (
                      <div className="p-12 text-center text-primary-500">
                        <FaCamera className="w-12 h-12 mx-auto mb-4 text-primary-300" />
                        <p className="text-body">No photos in this concert yet</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
            >
              {visiblePhotos.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group cursor-pointer mb-6 break-inside-avoid"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="card overflow-hidden">
                    <div className="relative overflow-hidden">
                      <LazyImage
                        src={image.thumbnail || image.src}
                        alt={image.alt}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                        placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDMyMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTI4TDE0NCAxNDRIMTc2TDE2MCAxMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=="
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-end">
                        <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-4 text-xs text-gray-300">
                            <span className="flex items-center gap-1">
                              <FaCamera className="w-4 h-4" />
                              {image.lens || 'Sony 28-70mm F3.5'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Load More Button - Only show for non-concerts category */}
          {selectedCategory !== 'concerts' && visibleRange.end < filteredPhotos.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisibleRange(prev => ({
                  start: prev.start,
                  end: Math.min(prev.end + 20, filteredPhotos.length)
                }))}
                className="btn btn-primary"
              >
                Load More Photos ({filteredPhotos.length - visibleRange.end} remaining)
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && (
            selectedCategory === 'concerts' ? (
              getConcertGroupedPhotos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <FaMusic className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-headline text-primary-600 mb-2">
                    No concerts yet
                  </h3>
                  <p className="text-body text-primary-500">
                    Check back soon for concert photography.
                  </p>
                </motion.div>
              )
            ) : (
              filteredPhotos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <FaCamera className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <h3 className="text-headline text-primary-600 mb-2">
                    No photos in this category
                  </h3>
                  <p className="text-body text-primary-500">
                    Check back soon for new additions to this collection.
                  </p>
                </motion.div>
              )
            )
          )}

          {/* Email Subscription Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <div className="card p-8 text-center bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <h3 className="text-headline text-primary-900 mb-3">
                    Stay Updated!
                  </h3>
                  <p className="text-body text-primary-700">
                    Subscribe to get email notifications whenever I post new photography adventures and stories.
                  </p>
                </div>
                
                <EmailSubscription />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setSelectedImage(null);
              setImageZoom(1);
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="relative lg:w-2/3 flex items-center justify-center min-h-[60vh]">
                  <div 
                    className="transform transition-transform duration-300 ease-in-out"
                    style={{ transform: `scale(${imageZoom})` }}
                  >
                    <LazyImage
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="max-w-full max-h-[85vh] sm:max-h-[90vh] w-auto h-auto object-contain"
                      placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik00MDAgMzAwTDM2MCAzNDBINDAwTDM2MCAzMDBaIiBmaWxsPSIjNjY2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjI4MCIgcj0iNDAiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cg=="
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {(() => {
                    const currentIndex = filteredPhotos.findIndex(img => img.id === selectedImage.id);
                    const hasPrevious = currentIndex > 0;
                    const hasNext = currentIndex < filteredPhotos.length - 1;
                    
                    return (
                      <>
                        {hasPrevious && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(filteredPhotos[currentIndex - 1]);
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                          >
                            <FaChevronLeft className="w-6 h-6" />
                          </button>
                        )}
                        
                        {hasNext && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(filteredPhotos[currentIndex + 1]);
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                          >
                            <FaChevronRight className="w-6 h-6" />
                          </button>
                        )}
                        
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentIndex + 1} / {filteredPhotos.length}
                        </div>
                      </>
                    );
                  })()}
                  
                  {/* Zoom Controls */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageZoom(prev => Math.max(0.5, prev - 0.25));
                      }}
                      className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                    >
                      <span className="text-lg font-bold">-</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageZoom(prev => Math.min(3, prev + 0.25));
                      }}
                      className="w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageZoom(1);
                      }}
                      className="px-3 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300 text-sm"
                    >
                      Reset
                    </button>
                    <div className="px-3 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm">
                      {Math.round(imageZoom * 100)}%
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImageZoom(1);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Info Section */}
                <div className="lg:w-1/3 p-8 bg-primary-50 border-l border-primary-200">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-title font-semibold text-primary-900 mb-2">
                        {selectedImage.title || selectedImage.alt}
                      </h3>
                      <p className="text-body text-primary-700">
                        {selectedImage.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedImage.date && (
                        <div>
                          <h4 className="text-caption font-semibold text-primary-700 mb-1">Date</h4>
                          <p className="text-caption text-primary-600">{selectedImage.date}</p>
                        </div>
                      )}
                      
                      {selectedImage.lens && (
                        <div>
                          <h4 className="text-caption font-semibold text-primary-700 mb-1">Lens</h4>
                          <p className="text-caption text-primary-600">{selectedImage.lens}</p>
                        </div>
                      )}
                      
                      {selectedImage.location && (
                        <div>
                          <h4 className="text-caption font-semibold text-primary-700 mb-1">Location</h4>
                          <p className="text-caption text-primary-600">{selectedImage.location}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-caption font-semibold text-primary-700 mb-1">Category</h4>
                        <p className="text-caption text-primary-600">
                          {photoCategories[selectedImage.category]?.name || selectedImage.category}
                        </p>
                      </div>
                    </div>
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

export default Photography;
