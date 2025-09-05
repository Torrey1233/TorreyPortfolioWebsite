import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, /* FaInstagram, */ FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/torrey1233', icon: <FaGithub /> },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/torreyliu', icon: <FaLinkedin /> },
    // { name: 'Instagram', url: 'https://instagram.com/torreyliu', icon: <FaInstagram /> },
    { name: 'Email', url: 'mailto:torreyliu2004@gmail.com', icon: <FaEnvelope /> },
  ];

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-cinematic">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <h3 className="text-headline font-playfair font-bold">
                Torrey Liu
              </h3>
              <p className="text-body text-primary-300 max-w-md">
                Creative technologist building intelligent systems and capturing stories through a lens. 
                Exploring the intersection of technology and art.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-title font-semibold">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/" 
                    className="text-body text-primary-300 hover:text-accent-400 transition-colors duration-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="/projects" 
                    className="text-body text-primary-300 hover:text-accent-400 transition-colors duration-300"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a 
                    href="/photography" 
                    className="text-body text-primary-300 hover:text-accent-400 transition-colors duration-300"
                  >
                    Photography
                  </a>
                </li>
                <li>
                  <a 
                    href="/resume" 
                    className="text-body text-primary-300 hover:text-accent-400 transition-colors duration-300"
                  >
                    Resume
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6">
              <h4 className="text-title font-semibold">Connect</h4>
              <div className="space-y-4">
                <a 
                  href="mailto:torreyliu2004@gmail.com"
                  className="block text-body text-primary-300 hover:text-accent-400 transition-colors duration-300"
                >
                  torreyliu2004@gmail.com
                </a>
                
                {/* Social Links */}
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center text-primary-300 hover:bg-accent-600 hover:text-white transition-all duration-300"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary-800 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-caption text-primary-400">
                © 2025 Torrey Liu. All rights reserved.
              </p>
              <p className="text-caption text-primary-400">
                Built with React, Tailwind CSS, and Framer Motion
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
