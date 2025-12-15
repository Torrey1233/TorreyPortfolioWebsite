import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaStarHalfAlt,
  FaImages,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle
} from 'react-icons/fa';

// Hardcoded categories that match the gallery
const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All Photos', icon: '📸' },
  { id: 'street', name: 'Street Photography', icon: '🏙️' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'astro', name: 'Astrophotography', icon: '🌌' },
  { id: 'concerts', name: 'Concerts', icon: '🎵' },
  { id: 'clubs', name: 'Clubs', icon: '🎪' },
  { id: 'sports', name: 'Sports', icon: '⚽' }
];

const API_BASE_URL = 'http://localhost:3001';

const FeaturedPhotosManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const isAvailable = await checkApiConnection();
      if (isAvailable) {
        await fetchImages();
        await fetchFeaturedImages();
      }
    };
    initialize();
  }, [selectedCategory]);

  // Separate effect to refetch when API becomes available
  useEffect(() => {
    if (apiAvailable) {
      fetchImages();
      fetchFeaturedImages();
    }
  }, [apiAvailable]);

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

  const fetchImages = async () => {
    if (!apiAvailable) return;
    
    try {
      setLoading(true);
      // Fetch all images from database
      const imagesResponse = await fetch(`${API_BASE_URL}/api/images?limit=10000`);
      const imagesData = await imagesResponse.json();
      
      // Also fetch blog posts to get their images
      const blogResponse = await fetch(`${API_BASE_URL}/api/blog-posts`);
      const blogData = await blogResponse.json();
      
      let allImages = imagesData.images || [];
      
      // Add blog post images to the images list
      if (blogData.blogPosts) {
        blogData.blogPosts.forEach(blogPost => {
          if (blogPost.images && Array.isArray(blogPost.images)) {
            blogPost.images.forEach(imageFilename => {
              // Check if this image already exists in images
              const exists = allImages.some(img => img.filename === imageFilename);
              if (!exists) {
                // Create a virtual image entry for blog images
                allImages.push({
                  id: `blog-${blogPost.id}-${imageFilename}`,
                  filename: imageFilename,
                  title: imageFilename,
                  description: `From blog post: ${blogPost.title}`,
                  category: blogPost.category || 'blog',
                  date: blogPost.date,
                  source: 'blog',
                  blogPostId: blogPost.id,
                  blogPostTitle: blogPost.title,
                  folder: null,
                  featured: false
                });
              }
            });
          }
        });
      }
      
      // Get all uploaded images (not just by category - user can assign any photo to any category)
      setImages(allImages);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to fetch images. Make sure the API server is running.');
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedImages = async () => {
    if (!apiAvailable) return;
    
    try {
      // For "all" category, fetch all featured photos; otherwise filter by category
      const categoryParam = selectedCategory === 'all' ? '' : `?category=${selectedCategory}`;
      const response = await fetch(`${API_BASE_URL}/api/featured-photos${categoryParam}`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter by selected category if not "all"
        let featured = data.featuredPhotos || [];
        if (selectedCategory !== 'all') {
          featured = featured.filter(img => img.category === selectedCategory);
        }
        setFeaturedImages(featured);
      }
    } catch (err) {
      console.error('Failed to fetch featured images:', err);
    }
  };

  const toggleFeatured = async (imageId, currentlyFeatured) => {
    if (!apiAvailable) {
      setError('API server is not available');
      return;
    }

    try {
      const image = images.find(img => img.id === imageId);
      const isFeaturedInThisCategory = featuredImages.some(img => img.id === imageId);
      
      // When featuring: set category and featured=true
      // When unfeaturing: set featured=false (but keep category for reference)
      const shouldBeFeatured = !isFeaturedInThisCategory;
      
      // Check if this is a blog photo (virtual entry) that needs to be created in Image table
      if (image && image.source === 'blog' && shouldBeFeatured) {
        // Check if Image record exists for this blog photo
        const existingImage = await fetch(`${API_BASE_URL}/api/images?limit=10000`);
        const existingData = await existingImage.json();
        const imageExists = existingData.images?.some(img => img.filename === image.filename);
        
        if (!imageExists) {
          // Create Image record for blog photo
          const createResponse = await fetch(`${API_BASE_URL}/api/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: image.filename,
              title: image.title || image.filename,
              description: image.description || `From blog post: ${image.blogPostTitle}`,
              category: shouldBeFeatured ? selectedCategory : (image.category || 'blog'),
              date: image.date || new Date().toISOString().split('T')[0],
              featured: shouldBeFeatured
            })
          });
          
          if (createResponse.ok) {
            const createdImage = await createResponse.json();
            // Update the image ID to the real one
            imageId = createdImage.image.id;
            // Refresh images list
            await fetchImages();
          } else {
            setError('Failed to create image record for blog photo');
            return;
          }
        } else {
          // Find the existing image ID
          const existingImg = existingData.images.find(img => img.filename === image.filename);
          if (existingImg) {
            imageId = existingImg.id;
          }
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          featured: shouldBeFeatured,
          category: shouldBeFeatured ? selectedCategory : (image?.category || null)
        }),
      });

      if (response.ok) {
        const updatedImage = await response.json();
        
        // Update local state
        setImages(prev => prev.map(img => 
          img.id === imageId ? { ...img, ...updatedImage.image, category: shouldBeFeatured ? selectedCategory : img.category } : img
        ));
        
        // Update featured images list for this category
        if (shouldBeFeatured) {
          const imageToAdd = images.find(img => img.id === imageId);
          if (imageToAdd) {
            setFeaturedImages(prev => [...prev, { ...imageToAdd, featured: true, category: selectedCategory }]);
          }
        } else {
          setFeaturedImages(prev => prev.filter(img => img.id !== imageId));
        }
        
        // Refresh images to get updated data
        fetchImages();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update featured status');
      }
    } catch (err) {
      setError('Failed to update featured status. Make sure the API server is running.');
      console.error('Error toggling featured:', err);
    }
  };

  const handleImageClick = (imageId, currentlyFeatured, event) => {
    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd + Click: Toggle individual selection
      toggleFeatured(imageId, currentlyFeatured);
    } else {
      // Regular click: Toggle featured status
      toggleFeatured(imageId, currentlyFeatured);
    }
  };

  const filteredImages = images.filter(image =>
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if image is featured in the selected category
  const isFeaturedInCategory = (imageId) => {
    return featuredImages.some(img => img.id === imageId);
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Gallery Featured Photos Manager</h2>
          <p className="text-gray-600">Select which uploaded photos to feature in the main gallery for each category</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaStar className="w-4 h-4 text-yellow-500" />
          <span>{featuredImages.length} featured in {GALLERY_CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory} • {images.length} total photos available</span>
        </div>
      </div>

      {/* API Connection Warning */}
      {!apiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <FaExclamationTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 mb-1">API Server Not Running</h3>
            <p className="text-sm text-yellow-700 mb-2">
              {error || 'Please start the API server to manage featured photos.'}
            </p>
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

      {/* Category Selection */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Gallery Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!apiAvailable}
          >
            {GALLERY_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!apiAvailable}
            />
          </div>
        </div>
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

      {/* Featured Images Summary */}
      {featuredImages.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Currently Featured ({featuredImages.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {featuredImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={`/images/thumbnails/${image.filename}`}
                  alt={image.title || image.filename}
                  className="w-full h-16 object-cover rounded border-2 border-yellow-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="w-full h-16 bg-gray-200 flex items-center justify-center text-gray-400 text-xs rounded border-2 border-yellow-300"
                  style={{ display: 'none' }}
                >
                  <FaImages className="w-4 h-4" />
                </div>
                <div className="absolute top-1 right-1">
                  <FaStar className="w-3 h-3 text-yellow-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredImages.map((image, index) => {
          // Construct image path based on folder structure
          let imagePath = '';
          if (image.folder?.path) {
            const folderPath = image.folder.path.replace('/photos/', '');
            imagePath = `/images/${folderPath}/${image.filename}`;
          } else {
            imagePath = `/images/uploads/${image.filename}`;
          }
          
          return (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                isFeaturedInCategory(image.id)
                  ? 'border-yellow-400 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={(e) => handleImageClick(image.id, isFeaturedInCategory(image.id), e)}
            >
              <div className="relative w-full h-32 bg-gray-100">
                <img
                  src={`/images/thumbnails/${image.filename}`}
                  alt={image.title || image.filename || 'Image'}
                  className="w-full h-full object-cover"
                  loading={index < 20 ? "eager" : "lazy"}
                  onError={(e) => {
                    e.target.src = imagePath;
                    e.target.onerror = () => {
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
              
              {/* Featured Badge */}
              {isFeaturedInCategory(image.id) && (
                <div className="absolute top-2 right-2">
                  <div className="bg-yellow-500 text-white rounded-full p-1">
                    <FaStar className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                <p className="text-xs truncate">
                  {image.title || image.filename || 'Untitled'}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-75">
                    {isFeaturedInCategory(image.id) ? `Featured in ${GALLERY_CATEGORIES.find(c => c.id === selectedCategory)?.name}` : 'Click to feature'}
                  </span>
                  {isFeaturedInCategory(image.id) ? (
                    <FaEye className="w-3 h-3" />
                  ) : (
                    <FaEyeSlash className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  {isFeaturedInCategory(image.id) ? (
                    <div className="bg-red-500 text-white rounded-full p-2">
                      <FaEyeSlash className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-yellow-500 text-white rounded-full p-2">
                      <FaStar className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No images in this category.'}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Select a gallery category from the dropdown (All Photos, Street, Automotive, Astro, Concerts, Clubs, Sports)</li>
          <li>• Click on any uploaded image to feature it in the selected category</li>
          <li>• Featured images will show a yellow star and border</li>
          <li>• Featured images will appear in the main gallery under the selected category</li>
          <li>• The same photo can be featured in multiple categories</li>
          <li>• Use the search to find specific images from all uploaded photos</li>
          <li>• All photos uploaded via Album Manager or Blog Posts will appear here</li>
          <li>• Make sure the API server is running for this feature to work</li>
        </ul>
      </div>
    </div>
  );
};

export default FeaturedPhotosManager;
