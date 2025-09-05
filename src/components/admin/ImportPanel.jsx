import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUpload, 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaCheck, 
  FaExclamationTriangle,
  FaClock,
  FaFolderOpen,
  FaCog,
  FaHistory
} from 'react-icons/fa';

const ImportPanel = () => {
  const [importJobs, setImportJobs] = useState([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeJobs, setActiveJobs] = useState(new Set());

  // Import form state
  const [importConfig, setImportConfig] = useState({
    sourcePath: '',
    mode: 'SCAN_ONLY',
    organizationStrategy: 'date_based',
    deduplicate: true,
    generateThumbnails: true,
    preserveOriginals: true,
    tags: '',
    category: '',
    slug: '',
  });

  useEffect(() => {
    fetchImportJobs();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchImportJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchImportJobs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/import');
      const data = await response.json();
      
      if (response.ok) {
        setImportJobs(data.jobs);
        // Track active jobs
        const active = new Set();
        data.jobs.forEach(job => {
          if (job.status === 'RUNNING' || job.status === 'PENDING') {
            active.add(job.id);
          }
        });
        setActiveJobs(active);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch import jobs');
    } finally {
      setLoading(false);
    }
  };

  const startImport = async (e) => {
    e.preventDefault();
    try {
      const config = {
        ...importConfig,
        tags: importConfig.tags ? importConfig.tags.split(',').map(t => t.trim()) : undefined,
      };

      const response = await fetch('http://localhost:3001/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setShowImportModal(false);
        setImportConfig({
          sourcePath: '',
          mode: 'SCAN_ONLY',
          organizationStrategy: 'date_based',
          deduplicate: true,
          generateThumbnails: true,
          preserveOriginals: true,
          tags: '',
          category: '',
          slug: '',
        });
        fetchImportJobs();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to start import job');
    }
  };

  const cancelImport = async (jobId) => {
    try {
      const response = await fetch(`/api/import/${jobId}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchImportJobs();
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to cancel import job');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'RUNNING':
        return <FaPlay className="w-4 h-4 text-blue-500" />;
      case 'DONE':
        return <FaCheck className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = end - start;
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressPercentage = (job) => {
    const total = job.created + job.skipped + job.deduped + job.errors;
    if (total === 0) return 0;
    return Math.round((job.created / total) * 100);
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
        <h2 className="text-2xl font-bold text-gray-900">Import Panel</h2>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaUpload className="w-4 h-4" />
          Start Import
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

      {/* Import Jobs List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Import Jobs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {importJobs.length > 0 ? (
            importJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{job.sourcePath}</h4>
                      <p className="text-sm text-gray-500">
                        {job.mode} • {formatDuration(job.startedAt, job.finishedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                    {activeJobs.has(job.id) && (
                      <button
                        onClick={() => cancelImport(job.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Cancel import"
                      >
                        <FaStop className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {job.status === 'RUNNING' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(job)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(job)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{job.created}</div>
                    <div className="text-gray-500">Created</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-yellow-600">{job.skipped}</div>
                    <div className="text-gray-500">Skipped</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{job.deduped}</div>
                    <div className="text-gray-500">Deduplicated</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{job.errors}</div>
                    <div className="text-gray-500">Errors</div>
                  </div>
                </div>

                {/* Log */}
                {job.log && (
                  <details className="mt-3">
                    <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                      View Log
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto">
                      {job.log}
                    </pre>
                  </details>
                )}
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaHistory className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No import jobs yet</h3>
              <p className="mb-4">Start your first import to begin organizing your photos.</p>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Import
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
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
              <h3 className="text-lg font-semibold mb-4">Start Import Job</h3>
              <form onSubmit={startImport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source Path
                  </label>
                  <input
                    type="text"
                    value={importConfig.sourcePath}
                    onChange={(e) => setImportConfig({ ...importConfig, sourcePath: e.target.value })}
                    placeholder="/path/to/photos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Import Mode
                    </label>
                    <select
                      value={importConfig.mode}
                      onChange={(e) => setImportConfig({ ...importConfig, mode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="SCAN_ONLY">Scan Only</option>
                      <option value="INGEST_COPY">Copy Files</option>
                      <option value="INGEST_MOVE">Move Files</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Strategy
                    </label>
                    <select
                      value={importConfig.organizationStrategy}
                      onChange={(e) => setImportConfig({ ...importConfig, organizationStrategy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date_based">Date Based</option>
                      <option value="post_based">Post Based</option>
                      <option value="tag_based">Tag Based</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={importConfig.category}
                      onChange={(e) => setImportConfig({ ...importConfig, category: e.target.value })}
                      placeholder="e.g., street, automotive, astro"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={importConfig.slug}
                      onChange={(e) => setImportConfig({ ...importConfig, slug: e.target.value })}
                      placeholder="e.g., my-photo-shoot"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={importConfig.tags}
                    onChange={(e) => setImportConfig({ ...importConfig, tags: e.target.value })}
                    placeholder="e.g., street, urban, golden-hour"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importConfig.deduplicate}
                      onChange={(e) => setImportConfig({ ...importConfig, deduplicate: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Deduplicate images</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importConfig.generateThumbnails}
                      onChange={(e) => setImportConfig({ ...importConfig, generateThumbnails: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Generate thumbnails</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importConfig.preserveOriginals}
                      onChange={(e) => setImportConfig({ ...importConfig, preserveOriginals: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Preserve originals</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Start Import
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
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
    </div>
  );
};

export default ImportPanel;

