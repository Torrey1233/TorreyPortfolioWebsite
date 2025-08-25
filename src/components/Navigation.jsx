import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'About', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Photography', path: '/photography' },
    { name: 'Resume', path: '/resume' },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/torrey1233', icon: <FaGithub /> },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/torreyliu', icon: <FaLinkedin /> },
    { name: 'Instagram', url: 'https://instagram.com/torreyliu', icon: <FaInstagram /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary-200' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-cinematic">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-headline font-playfair font-bold text-primary-900"
          >
            <NavLink to="/" className="hover:text-accent-600 transition-colors duration-300">
              Torrey Liu
            </NavLink>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
                             <NavLink
                 key={item.name}
                 to={item.path}
                 className={({ isActive }) =>
                   `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                     isActive
                       ? 'text-accent-600 bg-accent-50'
                       : 'text-primary-700 hover:text-accent-600 hover:bg-primary-50'
                   }`
                 }
                 end={item.path === '/'}
               >
                 {item.name}
               </NavLink>
            ))}
          </div>

          {/* Social Links */}
          <div className="hidden lg:flex items-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-accent-100 hover:text-accent-600 transition-all duration-300"
                aria-label={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-accent-100 hover:text-accent-600 transition-all duration-300"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-primary-200 bg-white/95 backdrop-blur-md"
            >
              <div className="py-6 space-y-4">
                {navItems.map((item) => (
                                     <NavLink
                     key={item.name}
                     to={item.path}
                     className={({ isActive }) =>
                       `px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                         isActive
                           ? 'text-accent-600 bg-accent-50'
                           : 'text-primary-700 hover:text-accent-600 hover:bg-primary-50'
                       }`
                     }
                     end={item.path === '/'}
                   >
                     {item.name}
                   </NavLink>
                ))}
                
                {/* Mobile Social Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-primary-200">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-accent-100 hover:text-accent-600 transition-all duration-300"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
