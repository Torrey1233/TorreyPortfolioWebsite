import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaSpinner, FaCheck, FaTimes, FaImages } from 'react-icons/fa';

const PhotoUploader = ({ onUploadComplete, onClose }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError(`${file.name} is too large (max 50MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setCurrentFiles(validFiles);
    uploadFiles(validFiles);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    // Show initial progress
    setUploadProgress(10);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    // Show progress for form data creation
    setUploadProgress(30);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Show progress for request sent
      setUploadProgress(70);

      const result = await response.json();

      if (response.ok) {
        setUploadedFiles(result.images);
        setUploadProgress(100);
        
        // Call the callback with uploaded images
        if (onUploadComplete) {
          onUploadComplete(result.images);
        }
      } else {
        setError(result.error || 'Upload failed');
        console.error('Upload error:', result);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message || 'Network error during upload'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const resetUpload = () => {
    setUploading(false);
    setUploadProgress(0);
    setUploadedFiles([]);
    setCurrentFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Photos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {!uploading && uploadedFiles.length === 0 && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <FaImages className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop photos here or click to browse
            </h3>
            <p className="text-gray-500 mb-4">
              Supports JPG, PNG, GIF up to 50MB each (up to 500 photos per upload)
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <FaUpload className="w-4 h-4 inline mr-2" />
              Select Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {uploading && (
          <div className="text-center py-8">
            <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Uploading photos...
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {uploadProgress < 30 ? 'Preparing files...' : 
               uploadProgress < 70 ? 'Uploading to server...' : 
               'Processing and generating thumbnails...'}
            </p>
            {currentFiles && currentFiles.length > 50 && (
              <p className="text-xs text-blue-600 mt-2">
                Large batch detected ({currentFiles.length} files) - this may take a few minutes
              </p>
            )}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload Complete! ({uploadedFiles.length} photos)
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={resetUpload}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Upload More
                </button>
                <button
                  onClick={onClose}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {uploadedFiles.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <img
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
                  />
                  <div className="absolute top-1 right-1">
                    <FaCheck className="w-4 h-4 text-green-500 bg-white rounded-full p-1" />
                  </div>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {image.title}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                ✅ Photos uploaded successfully and are now available in your image library!
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h3 className="font-semibold text-blue-800 mb-2">Upload Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Large batches:</strong> Upload up to 500 photos at once (perfect for shoots!)</li>
            <li>• <strong>File size:</strong> Each photo can be up to 50MB (high-res RAW files supported)</li>
            <li>• <strong>Formats:</strong> JPG, PNG, GIF are all supported</li>
            <li>• <strong>Deduplication:</strong> Duplicate photos are automatically skipped</li>
            <li>• <strong>Thumbnails:</strong> Generated automatically for fast previews</li>
            <li>• <strong>Cloud storage:</strong> Photos are available across all albums and blog posts</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoUploader;
