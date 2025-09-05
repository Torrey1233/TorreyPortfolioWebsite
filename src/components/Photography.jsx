import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LazyImage from './LazyImage';
import { 
  photoMetadata, 
  blogPosts as staticBlogPosts,
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
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [imageZoom, setImageZoom] = useState(1);

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

  // Virtual scrolling for performance
  const visibleImages = filteredImages.slice(visibleRange.start, visibleRange.end);

  // Fetch blog posts from API and combine with static ones
  const fetchBlogPosts = async () => {
    try {
      setLoadingBlogs(true);
      console.log('Fetching blog posts...');
      console.log('Static blog posts available:', Object.keys(staticBlogPosts));
      
      const response = await fetch('http://localhost:3001/api/blog-posts');
      const data = await response.json();
      
      if (response.ok) {
        // Filter only published blog posts from API
        const publishedApiPosts = data.blogPosts.filter(post => post.published);
        console.log('Published API posts:', publishedApiPosts.length);
        
        // Convert static blog posts to the same format as API posts
        const staticPosts = Object.values(staticBlogPosts).map(post => {
          console.log('Converting static post:', post.title, 'with', post.photos?.length || 0, 'photos');
          return {
            id: post.id,
            title: post.title,
            slug: post.id,
            description: post.description,
            date: post.date,
            tags: post.tags || [],
            featured: post.featured || false,
            published: true, // Static posts are always published
            images: post.photos || [],
            category: post.category || 'general',
            equipment: post.equipment || null,
            location: post.location || '',
            weather: post.weather || '',
            notes: post.notes || '',
            isStatic: true // Flag to identify static posts
          };
        });
        console.log('Static posts converted:', staticPosts.length);
        
        // Combine API and static blog posts
        const allPosts = [...publishedApiPosts, ...staticPosts];
        console.log('Total blog posts:', allPosts.length);
        setBlogPosts(allPosts);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
      // Fallback to static blog posts only
      const staticPosts = Object.values(staticBlogPosts).map(post => ({
        id: post.id,
        title: post.title,
        slug: post.id,
        description: post.description,
        date: post.date,
        tags: post.tags || [],
        featured: post.featured || false,
        published: true,
        images: post.photos || [],
        category: post.category || 'general',
        equipment: post.equipment || null,
        location: post.location || '',
        weather: post.weather || '',
        notes: post.notes || '',
        isStatic: true
      }));
      console.log('Fallback: Using static posts only:', staticPosts.length);
      setBlogPosts(staticPosts);
    } finally {
      setLoadingBlogs(false);
    }
  };

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

  // Reset virtual scrolling when category changes
  useEffect(() => {
    setVisibleRange({ start: 0, end: 20 });
  }, [selectedCategory]);

  // Preload images for better performance
  const preloadImage = (src) => {
    if (preloadedImages.has(src)) return;
    
    const img = new Image();
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, src]));
    };
    img.src = src;
  };

  // Preload next/previous images in lightbox
  useEffect(() => {
    if (selectedImage && activeTab === 'gallery') {
      const currentIndex = allPhotos.findIndex(img => img.src === selectedImage.src);
      if (currentIndex > 0) preloadImage(allPhotos[currentIndex - 1].src);
      if (currentIndex < allPhotos.length - 1) preloadImage(allPhotos[currentIndex + 1].src);
    }
  }, [selectedImage, activeTab, allPhotos, preloadedImages]);

  // Fetch blog posts on component mount
  useEffect(() => {
    console.log('Component mounted, static blog posts:', staticBlogPosts);
    fetchBlogPosts();
  }, []);

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
        const currentBlogPost = blogPosts.find(post => 
          (post.images || []).some(imageData => {
            const filename = typeof imageData === 'string' ? imageData : imageData.filename;
            return selectedImage.src.includes(filename);
          })
        );
        if (currentBlogPost) {
          currentImageList = (currentBlogPost.images || []).map(imageData => {
            const filename = typeof imageData === 'string' ? imageData : imageData.filename;
            const imageSrc = currentBlogPost.isStatic 
              ? `/images/blog-posts/${currentBlogPost.id}/${filename}`
              : `/images/uploads/${filename}`;
            return {
              src: imageSrc,
              alt: filename,
              title: filename,
              category: currentBlogPost.category || 'blog',
              date: currentBlogPost.date,
              location: '',
              description: '',
              camera: '',
              lens: '',
              settings: {},
              tags: currentBlogPost.tags || []
            };
          });
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
                {visibleImages.map((image, idx) => (
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
                        <LazyImage
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                          placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDMyMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgMTI4TDE0NCAxNDRIMTc2TDE2MCAxMjhaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjExMiIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=="
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
              
              {/* Load More Button */}
              {visibleRange.end < filteredImages.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleRange(prev => ({
                      start: prev.start,
                      end: Math.min(prev.end + 20, filteredImages.length)
                    }))}
                    className="btn btn-primary"
                  >
                    Load More Photos ({filteredImages.length - visibleRange.end} remaining)
                  </button>
                </div>
              )}

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
              {loadingBlogs ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  <span className="ml-3 text-primary-600">Loading blog posts...</span>
                </div>
              ) : blogPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-primary-600">No blog posts available yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Debug: Loading={loadingBlogs ? 'Yes' : 'No'}, Count={blogPosts.length}</p>
                </div>
              ) : (
                (() => {
                  console.log('Rendering blog posts:', blogPosts.length);
                  console.log('Blog posts data:', blogPosts);
                  return blogPosts
                    .sort((a, b) => {
                      const dateA = new Date(a.date);
                      const dateB = new Date(b.date);
                      return dateB - dateA;
                    })
                    .map((post, idx) => {
                    // Start collapsed for all posts (show only 4 photos initially)
                    const isExpanded = expandedBlog === post.id;
                    const visiblePhotos = isExpanded ? (post.images || []) : (post.images || []).slice(0, 4);
                    const hasMorePhotos = (post.images || []).length > 4;
                
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
                      
                      {/* Equipment and Location Info (for static posts) */}
                      {post.isStatic && (post.equipment || post.location || post.weather) && (
                        <div className="mt-6 pt-6 border-t border-primary-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {post.equipment && (
                              <div>
                                <h4 className="text-sm font-semibold text-primary-800 mb-2">Equipment</h4>
                                <div className="space-y-1 text-sm text-primary-600">
                                  <p><span className="font-medium">Camera:</span> {post.equipment.camera}</p>
                                  {post.equipment.lenses && (
                                    <p><span className="font-medium">Lenses:</span> {post.equipment.lenses.join(', ')}</p>
                                  )}
                                  {post.equipment.accessories && (
                                    <p><span className="font-medium">Accessories:</span> {post.equipment.accessories.join(', ')}</p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {(post.location || post.weather) && (
                              <div>
                                <h4 className="text-sm font-semibold text-primary-800 mb-2">Details</h4>
                                <div className="space-y-1 text-sm text-primary-600">
                                  {post.location && (
                                    <p><span className="font-medium">Location:</span> {post.location}</p>
                                  )}
                                  {post.weather && (
                                    <p><span className="font-medium">Weather:</span> {post.weather}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {post.notes && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-primary-800 mb-2">Notes</h4>
                              <p className="text-sm text-primary-600 italic">{post.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Blog Post Images Section */}
                    <div className="p-8">
                      {/* Images Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {visiblePhotos.map((imageData, imageIdx) => {
                          // Handle both API format (object with filename) and static format (string filename)
                          const filename = typeof imageData === 'string' ? imageData : imageData.filename;
                          // Use thumbnails for grid view, full resolution for lightbox
                          const thumbnailSrc = post.isStatic 
                            ? `/images/blog-posts/${post.id}/${filename}`
                            : `/images/thumbnails/${filename}`;
                          const fullSizeSrc = post.isStatic 
                            ? `/images/blog-posts/${post.id}/${filename}`
                            : `/images/uploads/${filename}`;
                          return (
                            <motion.div
                              key={imageIdx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: (idx * 0.1) + (imageIdx * 0.1) }}
                              className="group cursor-pointer"
                              onClick={() => setSelectedImage({ src: fullSizeSrc, alt: post.title })}
                            >
                              <div className="card overflow-hidden hover:shadow-lg transition-all duration-300">
                                <div className="relative overflow-hidden">
                                  <LazyImage
                                    src={thumbnailSrc}
                                    alt={`${post.title} - Image ${imageIdx + 1}`}
                                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                                    placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDMyMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgNjRMMTQ0IDgwSDE3NkwxNjAgNjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjQ4IiByPSI4IiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo="
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
                                ? `Show Less (${(post.images || []).length - 4} fewer photos)` 
                                : `Show All ${(post.images || []).length} Photos`
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
              })
                })()
              )}
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
                      const currentBlogPost = blogPosts.find(post => 
                        (post.images || []).some(imageData => {
                          const filename = typeof imageData === 'string' ? imageData : imageData.filename;
                          return selectedImage.src.includes(filename);
                        })
                      );
                      if (currentBlogPost) {
                        currentImageList = (currentBlogPost.images || []).map(imageData => {
                          const filename = typeof imageData === 'string' ? imageData : imageData.filename;
                          const imageSrc = currentBlogPost.isStatic 
                            ? `/images/blog-posts/${currentBlogPost.id}/${filename}`
                            : `/images/uploads/${filename}`;
                          return {
                            src: imageSrc,
                            alt: filename,
                            title: filename,
                            category: currentBlogPost.category || 'blog',
                            date: currentBlogPost.date,
                            location: '',
                            description: '',
                            camera: '',
                            lens: '',
                            settings: {},
                            tags: currentBlogPost.tags || []
                          };
                        });
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
