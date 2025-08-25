import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { 
  photoMetadata, 
  blogPosts, 
  photoCategories,
  getPhotosByCategory,
  getAllPhotos
} from '../data/photography-data.js';

const Photography = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGear, setShowGear] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [expandedBlog, setExpandedBlog] = useState(null);

  // Convert photoMetadata to the format expected by the component
  const allPhotos = useMemo(() => {
    const photos = getAllPhotos();
    return photos.map(photo => {
      return {
        src: `/images/processed/${photo.category}/${photo.filename}`,
        alt: photo.title || photo.filename,
        category: photo.category,
        title: photo.title,
        description: photo.description,
        date: photo.date,
        lens: photo.lens,
        location: photo.location,
        exifData: null
      };
    });
  }, []);

  const filteredImages = selectedCategory === 'all' 
    ? allPhotos 
    : allPhotos.filter(img => img.category === selectedCategory);

  // Update category counts dynamically
  useEffect(() => {
    if (allPhotos.length > 0) {
      // Update category counts
      Object.keys(photoCategories).forEach(categoryId => {
        const count = allPhotos.filter(img => img.category === categoryId).length;
        if (photoCategories[categoryId]) {
          photoCategories[categoryId].count = count;
        }
      });
    }
  }, [allPhotos]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;
      
      let currentImageList = [];
      let currentIndex = 0;
      
      if (activeTab === 'gallery') {
        if (selectedCategory === 'all') {
          currentImageList = allPhotos;
        } else {
          currentImageList = allPhotos.filter(img => img.category === selectedImage.category);
        }
        currentIndex = currentImageList.findIndex(img => img.src === selectedImage.src);
      } else if (activeTab === 'blog') {
        const currentBlogPost = Object.values(blogPosts).find(post => 
          post.photos.some(photo => selectedImage.src.includes(photo))
        );
        if (currentBlogPost) {
          currentImageList = currentBlogPost.photos.map(filename => ({
            src: `/images/blog-posts/${currentBlogPost.id}/${filename}`,
            alt: filename,
            title: filename,
            category: currentBlogPost.category,
            date: currentBlogPost.date,
            location: currentBlogPost.location,
            description: '',
            camera: currentBlogPost.equipment?.camera || '',
            lens: currentBlogPost.equipment?.lenses?.[0] || '',
            settings: {},
            tags: currentBlogPost.tags || []
          }));
          currentIndex = currentImageList.findIndex(img => img.src === selectedImage.src);
        }
      }
      
      switch (event.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            event.preventDefault();
            setSelectedImage(currentImageList[currentIndex - 1]);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < currentImageList.length - 1) {
            event.preventDefault();
            setSelectedImage(currentImageList[currentIndex + 1]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedImage(null);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, activeTab, selectedCategory, allPhotos, blogPosts]);

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
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-center">
              <div className="card p-2 inline-flex">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'gallery'
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => setActiveTab('blog')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === 'blog'
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  Blog
                </button>
              </div>
            </div>
          </motion.div>

          {/* Gallery Tab Content */}
          {activeTab === 'gallery' && (
            <>
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
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Photography Grid - Masonry Layout */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
              >
                {filteredImages.map((image, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group cursor-pointer mb-6 break-inside-avoid"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="card overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
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

              {/* Empty State */}
              {filteredImages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-headline text-primary-600 mb-2">
                    No photos in this category
                  </h3>
                  <p className="text-body text-primary-500">
                    Check back soon for new additions to this collection.
                  </p>
                </motion.div>
              )}
            </>
          )}

          {/* Blog Tab Content */}
          {activeTab === 'blog' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              {Object.values(blogPosts)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((post, idx) => {
                const isExpanded = expandedBlog === post.id;
                const visiblePhotos = isExpanded ? post.photos : post.photos.slice(0, 4);
                const hasMorePhotos = post.photos.length > 4;
                
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="card overflow-hidden"
                  >
                    {/* Blog Post Header */}
                    <div className="p-8 border-b border-primary-200">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-caption text-primary-500">{post.date}</span>
                        {post.featured && (
                          <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                      <h2 className="text-headline mb-4 text-primary-900">
                        {post.title}
                      </h2>
                      <p className="text-body text-primary-700 leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full bg-primary-100 text-primary-700 font-medium border border-primary-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Blog Post Images Section */}
                    <div className="p-8">
                      {/* Images Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {visiblePhotos.map((filename, imageIdx) => {
                          const imageSrc = `/images/blog-posts/${post.id}/${filename}`;
                          return (
                            <motion.div
                              key={imageIdx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: (idx * 0.1) + (imageIdx * 0.1) }}
                              className="group cursor-pointer"
                              onClick={() => setSelectedImage({ src: imageSrc, alt: post.title })}
                            >
                              <div className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="relative overflow-hidden">
                                  <img
                                    src={imageSrc}
                                    alt={`${post.title} - Image ${imageIdx + 1}`}
                                    loading="lazy"
                                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                    <FaCamera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Expand/Collapse Button */}
                      {hasMorePhotos && (
                        <div className="mt-6 text-center">
                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedBlog(null);
                              } else {
                                setExpandedBlog(post.id);
                              }
                            }}
                            className="btn-outline"
                          >
                            <span>
                              {isExpanded 
                                ? `Show Less (${post.photos.length - 4} fewer photos)` 
                                : `Show All ${post.photos.length} Photos`
                              }
                            </span>
                            <svg 
                              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
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
            onClick={() => setSelectedImage(null)}
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
                <div className="relative lg:w-2/3">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    loading="lazy"
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {(() => {
                    let currentImageList = [];
                    let currentIndex = 0;
                    
                    if (activeTab === 'gallery') {
                      if (selectedCategory === 'all') {
                        currentImageList = allPhotos;
                      } else {
                        currentImageList = allPhotos.filter(img => img.category === selectedImage.category);
                      }
                      currentIndex = currentImageList.findIndex(img => img.src === selectedImage.src);
                    } else if (activeTab === 'blog') {
                      const currentBlogPost = Object.values(blogPosts).find(post => 
                        post.photos.some(photo => selectedImage.src.includes(photo))
                      );
                      if (currentBlogPost) {
                        currentImageList = currentBlogPost.photos.map(filename => ({
                          src: `/images/blog-posts/${currentBlogPost.id}/${filename}`,
                          alt: filename,
                          title: filename,
                          category: currentBlogPost.category,
                          date: currentBlogPost.date,
                          location: currentBlogPost.location,
                          description: '',
                          camera: currentBlogPost.equipment?.camera || '',
                          lens: currentBlogPost.equipment?.lenses?.[0] || '',
                          settings: {},
                          tags: currentBlogPost.tags || []
                        }));
                        currentIndex = currentImageList.findIndex(img => img.src === selectedImage.src);
                      }
                    }
                    
                    const hasPrevious = currentIndex > 0;
                    const hasNext = currentIndex < currentImageList.length - 1;
                    
                    return (
                      <>
                        {hasPrevious && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(currentImageList[currentIndex - 1]);
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
                              setSelectedImage(currentImageList[currentIndex + 1]);
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                          >
                            <FaChevronRight className="w-6 h-6" />
                          </button>
                        )}
                        
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentIndex + 1} / {currentImageList.length}
                        </div>
                      </>
                    );
                  })()}
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedImage(null)}
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
