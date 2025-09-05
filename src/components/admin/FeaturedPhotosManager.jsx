import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, 
  FaStarHalfAlt,
  FaImages,
  FaSearch,
  FaFilter,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const FeaturedPhotosManager = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [images, setImages] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchImages();
      fetchFeaturedImages();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories);
        if (data.categories.length > 0) {
          setSelectedCategory(data.categories[0]);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/images?limit=1000&t=${Date.now()}`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter images by selected category
        const categoryImages = data.images.filter(img => 
          img.category === selectedCategory
        );
        setImages(categoryImages);
      }
    } catch (err) {
      console.error('Failed to fetch images:', err);
    }
  };

  const fetchFeaturedImages = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/featured-photos?category=${selectedCategory}`);
      const data = await response.json();
      
      if (response.ok) {
        setFeaturedImages(data.featuredPhotos);
      }
    } catch (err) {
      console.error('Failed to fetch featured images:', err);
    }
  };

  const toggleFeatured = async (imageId, currentlyFeatured) => {
    try {
      const response = await fetch(`http://localhost:3001/api/images/${imageId}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentlyFeatured }),
      });

      if (response.ok) {
        // Update local state
        setImages(prev => prev.map(img => 
          img.id === imageId ? { ...img, featured: !currentlyFeatured } : img
        ));
        
        // Update featured images list
        if (currentlyFeatured) {
          setFeaturedImages(prev => prev.filter(img => img.id !== imageId));
        } else {
          const image = images.find(img => img.id === imageId);
          if (image) {
            setFeaturedImages(prev => [...prev, { ...image, featured: true }]);
          }
        }
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update featured status');
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Photos Manager</h2>
          <p className="text-gray-600">Select which photos to feature in each category</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaStar className="w-4 h-4 text-yellow-500" />
          <span>{featuredImages.length} featured in {selectedCategory}</span>
        </div>
      </div>

      {/* Category Selection */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
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
                image.featured
                  ? 'border-yellow-400 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={(e) => handleImageClick(image.id, image.featured, e)}
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
              {image.featured && (
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
                    {image.featured ? 'Featured' : 'Click to feature'}
                  </span>
                  {image.featured ? (
                    <FaEye className="w-3 h-3" />
                  ) : (
                    <FaEyeSlash className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity">
                  {image.featured ? (
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
          <li>• Select a category from the dropdown above</li>
          <li>• Click on any image to toggle its featured status</li>
          <li>• Featured images will show a yellow star and border</li>
          <li>• Only featured images will appear in the gallery</li>
          <li>• Use the search to find specific images</li>
        </ul>
      </div>
    </div>
  );
};

export default FeaturedPhotosManager;
