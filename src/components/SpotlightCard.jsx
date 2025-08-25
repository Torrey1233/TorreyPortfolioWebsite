import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SpotlightCard = ({ item, type, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (type === 'project') {
      // Navigate to project case study page
      navigate(`/projects/${item.id || item.title.toLowerCase().replace(/\s+/g, '-')}`);
    } else if (type === 'photography') {
      // Open photography gallery
      navigate('/photography', { state: { selectedImage: item } });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="card card-hover h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={item.image || item.src}
            alt={item.title || item.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              type === 'project' 
                ? 'bg-accent-500 text-white' 
                : 'bg-white/90 text-primary-900'
            }`}>
              {type === 'project' ? 'Project' : item.category || 'Photography'}
            </span>
          </div>

          {/* Winner Badge for Projects */}
          {type === 'project' && item.isWinner && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-500 text-white">
                WINNER
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-title mb-3 text-primary-900 group-hover:text-accent-600 transition-colors duration-300">
            {item.title}
          </h3>
          
          <p className="text-body text-primary-600 mb-4 line-clamp-3">
            {item.description || item.shortInfo}
          </p>

          {/* Project-specific content */}
          {type === 'project' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tech?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs rounded-md bg-primary-100 text-primary-700 font-medium"
                >
                  {tech}
                </span>
              ))}
              {item.tech?.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-md bg-primary-100 text-primary-700 font-medium">
                  +{item.tech.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Photography-specific content */}
          {type === 'photography' && (
            <div className="flex items-center gap-4 text-caption text-primary-500 mb-4">
              {item.lens && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  {item.lens}
                </span>
              )}
              {item.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {item.location}
                </span>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between">
            <span className="text-caption text-primary-500 font-medium">
              {type === 'project' ? 'View Case Study' : 'View in Gallery'}
            </span>
            <motion.div
              whileHover={{ x: 4 }}
              className="w-6 h-6 text-primary-400 group-hover:text-accent-500 transition-colors duration-300"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpotlightCard;
