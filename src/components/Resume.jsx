import React from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaDownload } from 'react-icons/fa';

const Resume = () => {
  const resumeUrl = '/Torrey_Liu_CS_Resume_Updated_2025.pdf';
  
  return (
    <div className="pt-16 lg:pt-20">
      <section className="section-spacing bg-primary-50">
        <div className="container-cinematic">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-display mb-6 text-primary-900">
              Resume
            </h1>
            <p className="text-subtitle text-primary-600 max-w-3xl mx-auto">
              Download my professional resume with detailed experience, skills, and qualifications.
            </p>
          </motion.div>

          {/* Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="card overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-8 text-white text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaFilePdf className="text-4xl text-white" />
                </div>
                <h2 className="text-headline mb-2">
                  Torrey Liu
                </h2>
                <p className="text-subtitle opacity-90">
                  Computer Science Student & Software Developer
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Resume Info */}
                <div className="text-center mb-8 p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                  <p className="text-accent-600 font-bold text-lg mb-4">
                    📄 Resume Available for Download
                  </p>
                  <p className="text-body text-primary-700 mb-4">
                    Click the button below to download and view my comprehensive resume
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-caption text-primary-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-accent-500 rounded-full"></span>
                      Education
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Experience
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Skills
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Projects
                    </span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="text-center">
                  <motion.a
                    href={resumeUrl}
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 btn-primary"
                  >
                    <FaDownload className="text-xl" />
                    Download PDF Resume
                  </motion.a>
                </div>

                {/* Resume Preview */}
                <div className="mt-12">
                  <h3 className="text-title mb-6 text-primary-900">Resume Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <h4 className="text-subtitle font-semibold text-accent-600 mb-3">Education</h4>
                      <div className="space-y-2">
                        <p className="text-body font-medium text-primary-900">Carleton University</p>
                        <p className="text-caption text-primary-600">Bachelor of Computer Science</p>
                        <p className="text-caption text-primary-600">Expected Graduation: 2026</p>
                      </div>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-subtitle font-semibold text-accent-600 mb-3">Key Skills</h4>
                      <div className="space-y-2">
                        <p className="text-caption text-primary-700"><strong>Languages:</strong> Python, Java, JavaScript, C, SQL</p>
                        <p className="text-caption text-primary-700"><strong>Frameworks:</strong> React, Flask, Node.js</p>
                        <p className="text-caption text-primary-700"><strong>Tools:</strong> Git, Docker, AWS, Azure</p>
                      </div>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-subtitle font-semibold text-accent-600 mb-3">Experience</h4>
                      <div className="space-y-2">
                        <p className="text-caption text-primary-700"><strong>Data Engineer</strong> - Transport Canada</p>
                        <p className="text-caption text-primary-700"><strong>Software Engineer Intern</strong> - PCBest Networks</p>
                        <p className="text-caption text-primary-700"><strong>Client Services Rep</strong> - Natural Resources Canada</p>
                      </div>
                    </div>
                    
                    <div className="card p-6">
                      <h4 className="text-subtitle font-semibold text-accent-600 mb-3">Achievements</h4>
                      <div className="space-y-2">
                        <p className="text-caption text-primary-700">• 2x Hackathon Winner</p>
                        <p className="text-caption text-primary-700">• Dean's List Recipient</p>
                        <p className="text-caption text-primary-700">• Published Photography</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Resume;
