import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaFolder, 
  FaFolderOpen, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCog,
  FaChevronRight,
  FaChevronDown,
  FaImage
} from 'react-icons/fa';

const FolderManager = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [newFolder, setNewFolder] = useState({ name: '', path: '', parentId: '' });
  const [editFolder, setEditFolder] = useState({ id: '', name: '', path: '', parentId: '' });
  const [selectedStrategy, setSelectedStrategy] = useState('date_based');

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/folders');
      const data = await response.json();
      
      if (response.ok) {
        setFolders(data.folders);
      } else {
        setError(data.error || 'Failed to fetch folders');
      }
    } catch (err) {
      setError('Failed to fetch folders. Make sure the API server is running. Run: npm run api or npm run dev:full');
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFolder),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewFolder({ name: '', path: '', parentId: '' });
        fetchFolders();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to create folder');
    }
  };

  const updateFolder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/folders?id=${editFolder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFolder),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditFolder({ id: '', name: '', path: '', parentId: '' });
        fetchFolders();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update folder');
    }
  };

  const deleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder?')) return;

    try {
      const response = await fetch(`/api/folders?id=${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFolders();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to delete folder');
    }
  };

  const applyStrategy = async () => {
    if (!selectedFolder) return;

    try {
      const response = await fetch('/api/folders/apply-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: selectedFolder.id,
          strategy: selectedStrategy,
        }),
      });

      if (response.ok) {
        setShowStrategyModal(false);
        fetchFolders();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to apply strategy');
    }
  };

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const openEditModal = (folder) => {
    setEditFolder({
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId || '',
    });
    setShowEditModal(true);
  };

  const openStrategyModal = (folder) => {
    setSelectedFolder(folder);
    setShowStrategyModal(true);
  };

  const renderFolderTree = (folderList, level = 0) => {
    return folderList.map((folder) => (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer ${
            selectedFolder?.id === folder.id ? 'bg-blue-100' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedFolder(folder)}
        >
          {folder.children && folder.children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expandedFolders.has(folder.id) ? (
                <FaChevronDown className="w-3 h-3" />
              ) : (
                <FaChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {expandedFolders.has(folder.id) ? (
            <FaFolderOpen className="w-4 h-4 text-blue-500" />
          ) : (
            <FaFolder className="w-4 h-4 text-blue-500" />
          )}

          <span className="flex-1 text-sm">{folder.name}</span>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FaImage className="w-3 h-3" />
              {folder._count?.images || 0}
            </span>
            
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(folder);
                }}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                title="Edit folder"
              >
                <FaEdit className="w-3 h-3" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openStrategyModal(folder);
                }}
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
                title="Apply strategy"
              >
                <FaCog className="w-3 h-3" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFolder(folder.id);
                }}
                className="p-1 hover:bg-red-200 rounded text-red-600"
                title="Delete folder"
              >
                <FaTrash className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expandedFolders.has(folder.id) && folder.children && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderFolderTree(folder.children, level + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Folder Manager</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          New Folder
        </button>
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

      {/* Folder Tree */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Folder Structure</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {folders.length > 0 ? (
            renderFolderTree(folders)
          ) : (
            <div className="p-8 text-center text-gray-500">
              No folders found. Create your first folder to get started.
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
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
              <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
              <form onSubmit={createFolder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Path
                  </label>
                  <input
                    type="text"
                    value={newFolder.path}
                    onChange={(e) => setNewFolder({ ...newFolder, path: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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

      {/* Edit Folder Modal */}
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
              <h3 className="text-lg font-semibold mb-4">Edit Folder</h3>
              <form onSubmit={updateFolder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={editFolder.name}
                    onChange={(e) => setEditFolder({ ...editFolder, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Path
                  </label>
                  <input
                    type="text"
                    value={editFolder.path}
                    onChange={(e) => setEditFolder({ ...editFolder, path: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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

      {/* Strategy Modal */}
      <AnimatePresence>
        {showStrategyModal && (
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
              <h3 className="text-lg font-semibold mb-4">Apply Organization Strategy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy
                  </label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date_based">Date Based (YYYY/MM/DD)</option>
                    <option value="post_based">Post Based (by slug)</option>
                    <option value="tag_based">Tag Based (by primary tag)</option>
                    <option value="custom">Custom Template</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  This will reorganize all images in the selected folder according to the chosen strategy.
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={applyStrategy}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Apply Strategy
                  </button>
                  <button
                    onClick={() => setShowStrategyModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FolderManager;

