import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const EmailSubscription = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! You\'ll receive notifications for new blog posts.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to connect. Please check your internet connection.');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4 h-4" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-primary-900 placeholder-primary-500"
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="px-6 py-3 bg-accent-500 text-white rounded-lg font-medium hover:bg-accent-600 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
            status === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {status === 'success' ? (
            <FaCheck className="w-4 h-4 text-green-600" />
          ) : (
            <FaExclamationTriangle className="w-4 h-4 text-red-600" />
          )}
          {message}
        </motion.div>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-primary-500">
        We respect your privacy. Unsubscribe at any time. No spam, just photography updates.
      </p>
    </div>
  );
};

export default EmailSubscription;
