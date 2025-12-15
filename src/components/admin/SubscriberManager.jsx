import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaTrash, FaDownload, FaUsers } from 'react-icons/fa';

const SubscriberManager = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscribers, setSelectedSubscribers] = useState(new Set());

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/subscribers');
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data.subscribers || []);
      } else {
        setError(data.error || 'Failed to fetch subscribers');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    try {
      const response = await fetch('http://localhost:3001/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribers(prev => prev.filter(s => s.email !== email));
        setSelectedSubscribers(prev => {
          const newSet = new Set(prev);
          newSet.delete(email);
          return newSet;
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to unsubscribe');
      }
    } catch (err) {
      setError('Failed to unsubscribe');
    }
  };

  const handleBulkUnsubscribe = async () => {
    if (selectedSubscribers.size === 0) return;

    try {
      for (const email of selectedSubscribers) {
        await handleUnsubscribe(email);
      }
      setSelectedSubscribers(new Set());
    } catch (err) {
      setError('Failed to bulk unsubscribe');
    }
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.size === subscribers.length) {
      setSelectedSubscribers(new Set());
    } else {
      setSelectedSubscribers(new Set(subscribers.map(s => s.email)));
    }
  };

  const handleSelectSubscriber = (email) => {
    const newSet = new Set(selectedSubscribers);
    if (newSet.has(email)) {
      newSet.delete(email);
    } else {
      newSet.add(email);
    }
    setSelectedSubscribers(newSet);
  };

  const exportSubscribers = () => {
    const csvContent = [
      'Email,Subscribed Date',
      ...subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleDateString()}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendTestEmail = async () => {
    const email = prompt('Enter email address to send test email to:');
    if (!email) return;

    try {
      const response = await fetch('http://localhost:3001/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Test email sent successfully to ${email}!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to send test email. Make sure the API server is running.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading subscribers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Subscribers</h2>
          <p className="text-gray-600">Manage blog notification subscribers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaUsers className="w-4 h-4" />
            <span>{subscribers.length} subscribers</span>
          </div>
          <button
            onClick={sendTestEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEnvelope className="w-4 h-4" />
            Test Email
          </button>
          <button
            onClick={exportSubscribers}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaDownload className="w-4 h-4" />
            Export CSV
          </button>
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

      {/* Bulk Actions */}
      {subscribers.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedSubscribers.size === subscribers.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">
              Select All ({selectedSubscribers.size} selected)
            </span>
          </label>
          
          {selectedSubscribers.size > 0 && (
            <button
              onClick={handleBulkUnsubscribe}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash className="w-4 h-4" />
              Unsubscribe Selected
            </button>
          )}
        </div>
      )}

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="text-center py-12">
          <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscribers yet</h3>
          <p className="text-gray-500">
            Subscribers will appear here when people sign up for blog notifications.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.size === subscribers.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscribed Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber, index) => (
                  <motion.tr
                    key={subscriber.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.has(subscriber.email)}
                        onChange={() => handleSelectSubscriber(subscriber.email)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaEnvelope className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(subscriber.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUnsubscribe(subscriber.email)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <FaTrash className="w-3 h-3" />
                        Unsubscribe
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Subscribers sign up through the blog section on your website</li>
          <li>• When you publish a new blog post, all subscribers receive an email notification</li>
          <li>• Subscribers can unsubscribe at any time</li>
          <li>• Export subscriber data as CSV for backup or analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default SubscriberManager;
