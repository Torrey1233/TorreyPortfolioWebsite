import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFolder, 
  FaImages, 
  FaUpload, 
  FaCog, 
  FaChartBar,
  FaDatabase,
  FaCloud,
  FaBlog,
  FaStar
} from 'react-icons/fa';
import FolderManager from './FolderManager';
import AlbumManager from './AlbumManager';
import ImportPanel from './ImportPanel';
import BlogPostManager from './BlogPostManager';
import FeaturedPhotosManager from './FeaturedPhotosManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('folders');

  const tabs = [
    {
      id: 'folders',
      name: 'Folders',
      icon: FaFolder,
      component: FolderManager,
      description: 'Manage folder structure and organization'
    },
    {
      id: 'albums',
      name: 'Albums',
      icon: FaImages,
      component: AlbumManager,
      description: 'Create and manage virtual photo collections'
    },
    {
      id: 'blog-posts',
      name: 'Blog Posts',
      icon: FaBlog,
      component: BlogPostManager,
      description: 'Create and manage blog posts with photos'
    },
    {
      id: 'featured',
      name: 'Featured Photos',
      icon: FaStar,
      component: FeaturedPhotosManager,
      description: 'Select which photos to feature in each gallery category'
    },
    {
      id: 'import',
      name: 'Import',
      icon: FaUpload,
      component: ImportPanel,
      description: 'Bulk import and organize photos'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: FaCog,
      component: () => <div className="p-8 text-center text-gray-500">Settings panel coming soon</div>,
      description: 'Configure organization strategies and preferences'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Photo Management Admin</h1>
              <p className="text-sm text-gray-600">Organize and manage your photography collection</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaDatabase className="w-4 h-4" />
                <span>Database Connected</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCloud className="w-4 h-4" />
                <span>S3 Storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon
                      className={`mr-2 w-5 h-5 ${
                        activeTab === tab.id
                          ? 'text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Description */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Active Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

