import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBlog, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaTag,
  FaImages,
  FaUpload
} from 'react-icons/fa';
import PhotoUploader from './PhotoUploader';

const BlogPostManager = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Form states
  const [newBlogPost, setNewBlogPost] = useState({ 
    title: '', 
    slug: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0],
    tags: '',
    featured: false,
    published: false
  });
  const [editBlogPost, setEditBlogPost] = useState({ 
    id: '', 
    title: '', 
    slug: '', 
    description: '', 
    date: '',
    tags: '',
    featured: false,
    published: false,
    images: []
  });
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
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

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/blog-posts');
      const data = await response.json();
      
      if (response.ok) {
        setBlogPosts(data.blogPosts);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
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

  const createBlogPost = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newBlogPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('http://localhost:3001/api/blog-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBlogPost,
          tags: tagsArray
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewBlogPost({ 
          title: '', 
          slug: '', 
          description: '', 
          date: new Date().toISOString().split('T')[0],
          tags: '',
          featured: false,
          published: false
        });
        fetchBlogPosts();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create blog post');
    }
  };

  const updateBlogPost = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = editBlogPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch(`http://localhost:3001/api/blog-posts/${editBlogPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editBlogPost,
          tags: tagsArray
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditBlogPost({ 
          id: '', 
          title: '', 
          slug: '', 
          description: '', 
          date: '',
          tags: '',
          featured: false,
          published: false,
          images: []
        });
        fetchBlogPosts();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update blog post');
    }
  };

  const deleteBlogPost = async (blogPostId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/blog-posts/${blogPostId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBlogPosts();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete blog post');
    }
  };

  const addImagesToBlogPost = async () => {
    if (!selectedBlogPost || selectedImages.length === 0) return;

    try {
      const imageFilenames = selectedImages.map(imageId => {
        const image = availableImages.find(img => img.id === imageId);
        return image ? image.filename : null;
      }).filter(Boolean);

      const response = await fetch(`http://localhost:3001/api/blog-posts/${selectedBlogPost.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          images: [...editBlogPost.images, ...imageFilenames]
        }),
      });

      if (response.ok) {
        setShowImagePicker(false);
        setSelectedImages([]);
        fetchBlogPosts();
        // Update editBlogPost state
        setEditBlogPost(prev => ({
          ...prev,
          images: [...prev.images, ...imageFilenames]
        }));
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to add images to blog post');
    }
  };

  const openEditModal = (blogPost) => {
    setEditBlogPost({
      id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      description: blogPost.description || '',
      date: blogPost.date ? new Date(blogPost.date).toISOString().split('T')[0] : '',
      tags: blogPost.tags ? blogPost.tags.join(', ') : '',
      featured: blogPost.featured || false,
      published: blogPost.published || false,
      images: blogPost.images || []
    });
    setShowEditModal(true);
  };

  const openImagePicker = (blogPost) => {
    setSelectedBlogPost(blogPost);
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

  const filteredBlogPosts = blogPosts.filter(blogPost =>
    blogPost.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blogPost.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blogPost.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedBlogPosts = [...filteredBlogPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'published':
        return (b.published ? 1 : 0) - (a.published ? 1 : 0);
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
        <h2 className="text-2xl font-bold text-gray-900">Blog Post Manager</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          New Blog Post
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blog posts..."
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
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="published">Sort by Published</option>
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

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedBlogPosts.map((blogPost) => (
          <motion.div
            key={blogPost.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Blog Post Cover */}
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {blogPost.images && blogPost.images.length > 0 ? (
                <img
                  src={`/images/thumbnails/${blogPost.images[0]}`}
                  alt={blogPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <FaBlog className="w-12 h-12 text-gray-400" />
              )}
              {/* Fallback placeholder */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                <FaBlog className="w-12 h-12" />
              </div>
            </div>

            {/* Blog Post Info */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{blogPost.title}</h3>
                {blogPost.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Featured
                  </span>
                )}
                {blogPost.published && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Published
                  </span>
                )}
              </div>
              
              {blogPost.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{blogPost.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <FaCalendar className="w-3 h-3" />
                  <span>{new Date(blogPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaImages className="w-3 h-3" />
                  <span>{blogPost.images?.length || 0} images</span>
                </div>
              </div>

              {blogPost.tags && blogPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {blogPost.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {blogPost.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{blogPost.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openImagePicker(blogPost)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  <FaPlus className="w-3 h-3" />
                  Add Photos
                </button>
                <button
                  onClick={() => openEditModal(blogPost)}
                  className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                  title="Edit blog post"
                >
                  <FaEdit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteBlogPost(blogPost.id)}
                  className="p-2 bg-red-200 text-red-600 rounded-md hover:bg-red-300 transition-colors"
                  title="Delete blog post"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedBlogPosts.length === 0 && (
        <div className="text-center py-12">
          <FaBlog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Create your first blog post to get started.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Blog Post
            </button>
          )}
        </div>
      )}

      {/* Create Blog Post Modal */}
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
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Create New Blog Post</h3>
              <form onSubmit={createBlogPost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={newBlogPost.title}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={newBlogPost.slug}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newBlogPost.description}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newBlogPost.date}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <select
                      multiple
                      value={newBlogPost.tags ? newBlogPost.tags.split(', ') : []}
                      onChange={(e) => {
                        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                        setNewBlogPost({ ...newBlogPost, tags: selectedTags.join(', ') });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      size="3"
                    >
                      <option value="automobiles">Automobiles</option>
                      <option value="street photography">Street Photography</option>
                      <option value="astrophotography">Astrophotography</option>
                      <option value="concerts">Concerts</option>
                      <option value="nature">Nature</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBlogPost.featured}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBlogPost.published}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, published: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Create Blog Post
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

      {/* Edit Blog Post Modal */}
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
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-semibold mb-4">Edit Blog Post</h3>
              <form onSubmit={updateBlogPost} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={editBlogPost.title}
                      onChange={(e) => setEditBlogPost({ ...editBlogPost, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={editBlogPost.slug}
                      onChange={(e) => setEditBlogPost({ ...editBlogPost, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editBlogPost.description}
                    onChange={(e) => setEditBlogPost({ ...editBlogPost, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={editBlogPost.date}
                      onChange={(e) => setEditBlogPost({ ...editBlogPost, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <select
                      multiple
                      value={editBlogPost.tags ? editBlogPost.tags.split(', ') : []}
                      onChange={(e) => {
                        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
                        setEditBlogPost({ ...editBlogPost, tags: selectedTags.join(', ') });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      size="3"
                    >
                      <option value="automobiles">Automobiles</option>
                      <option value="street photography">Street Photography</option>
                      <option value="astrophotography">Astrophotography</option>
                      <option value="concerts">Concerts</option>
                      <option value="nature">Nature</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tags</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editBlogPost.featured}
                      onChange={(e) => setEditBlogPost({ ...editBlogPost, featured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editBlogPost.published}
                      onChange={(e) => setEditBlogPost({ ...editBlogPost, published: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Published</span>
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update Blog Post
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
                  Add Photos to "{selectedBlogPost?.title}"
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
                        const folderPath = image.folder.path.replace('/photos/', '');
                        imagePath = `/images/${folderPath}/${image.filename}`;
                      } else {
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
                  onClick={addImagesToBlogPost}
                  disabled={selectedImages.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add {selectedImages.length} Photo{selectedImages.length !== 1 ? 's' : ''}
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

export default BlogPostManager;
