import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import { FaUser, FaProjectDiagram, FaFilePdf, FaCameraRetro, FaBars, FaGithub, FaLinkedin, FaTimes, FaHome, FaEnvelope } from 'react-icons/fa';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";
import ExifReader from 'exifreader';

const navItems = [
  { name: 'Home', path: '/home', icon: <FaHome /> },
  { name: 'About', path: '/', icon: <FaUser /> },
  { name: 'Projects', path: '/projects', icon: <FaProjectDiagram /> },
  { name: 'Resume', path: '/resume', icon: <FaFilePdf /> },
  { name: 'Photography', path: '/photography', icon: <FaCameraRetro /> },
];

function SynthwaveNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#181818] border-b-4 border-[var(--neon-blue)] shadow-md">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center py-6 px-8">
        {/* Left Spacer */}
        <div className="w-64"></div>
        
        {/* Centered Navigation Items */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 text-lg font-mono ${
                  isActive 
                    ? 'bg-[#23233a] text-cyan-300 border-2 border-pink-500 shadow-lg drop-shadow-[0_0_16px_#00ffff] hover:shadow-xl' 
                    : 'text-cyan-300 hover:bg-[#23233a]/80 hover:shadow-md hover:drop-shadow-[0_0_24px_#00ffff]'
                }`
              }
              end={item.path === '/'}
              onClick={() => setMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
        
        {/* Contact Info - Right Side */}
        <div className="w-64 text-center p-3">
          <h3 className="text-sm font-bold mb-1 text-cyan-300">Shoot me a message!</h3>
          <p className="text-xs mb-1">Let's coffee chat!</p>
          <a 
            href="mailto:torreyliu2004@gmail.com" 
            className="text-[var(--neon-blue)] hover:text-[var(--neon-pink)] transition-colors duration-300 underline text-xs"
          >
            torreyliu2004@gmail.com
          </a>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between px-6 py-4">
        <div className="font-mono text-2xl text-cyan-300 animate-pulse">Torrey Liu</div>
        <button
          className="text-[var(--neon-pink)] text-2xl hover:text-[var(--neon-blue)] transition-colors duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#181818] border-t-2 border-[var(--neon-blue)] shadow"
          >
            <div className="flex flex-col gap-2 p-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-lg font-mono ${
                      isActive 
                        ? 'text-cyan-300 border-b-2 border-cyan-300' 
                        : 'text-cyan-300 hover:text-pink-400'
                    }`
                  }
                  end={item.path === '/'}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function About() {
  const navigate = useNavigate();
  
  const experiences = [
    {
      title: "Data Engineer",
      company: "Transport Canada",
      period: "May 2025 – Present",
      location: "Ottawa, ON",
      achievements: [
        "Validated and debugged Python and PySpark code in Azure Databricks for hydrogen rail risk simulations",
        "Analyzed real-world rail route data with GeoPandas and SQL to support geospatial modeling",
        "Built Power BI dashboards to communicate insights and support internal collaboration"
      ]
    },
    {
      title: "Client Services Representative",
      company: "Natural Resources Canada",
      period: "Oct 2024 – Mar 2025",
      location: "Ottawa, ON",
      achievements: [
        "Installed and configured 32 Polycom video conferencing systems to enhance team communication",
        "Managed IT inventory and troubleshooting with Excel and on-site support",
        "Handled client requests through ASSYST ticketing system with high resolution rates"
      ]
    },
    {
      title: "Software Engineer Intern",
      company: "PCBest Networks",
      period: "May 2023 – Aug 2023",
      location: "Hybrid",
      achievements: [
        "Developed AI-powered chatbots for Discord, Slack, and WhatsApp using Python, Flask, and GPT-3.5",
        "Enhanced chatbot response flow by integrating OpenAI APIs and conversation memory"
      ]
    },
    {
      title: "Hardware Engineer Intern",
      company: "PCBest Networks",
      period: "May 2022 - May 2023",
      location: "",
      achievements: [
        "Replaced server parts and did the required repairs while involving in the troubleshooting and debugging activity to actively maintain optimal functionality among the server infrastructure",
        "Configured effectual cost-effective components and strategically planned accurate selections for the optimization of high-performance PCs of the company"
      ]
    }
  ];

  const courses = [
    "COMP1405 – Introduction to Computer Science (Python)",
    "COMP1406 – Introduction to Computer Science II (Java OOP)",
    "COMP1805 – Discrete Structures I",
    "COMP2401 – Introduction to Systems Programming (C)",
    "COMP2402 – Abstract Data Types and Algorithms (Java)",
    "COMP2406 – Fundamentals of Web Applications (JavaScript, SQL)",
    "COMP2804 – Discrete Structures II",
    "MATH1104 – Linear Algebra I",
    "MATH2107 – Linear Algebra II",
    "MATH1007 – Elementary Calculus I"
  ];

  const hobbies = [
    { icon: "📷", name: "Photography", description: "Visual storytelling through the lens" },
    { icon: "🎸", name: "Electric Guitar", description: "Rocking out with six strings" },
    { icon: "🥁", name: "Drumming", description: "Keeping the rhythm alive" },
    { icon: "🏐", name: "Volleyball", description: "Team sports and coordination" },
    { icon: "✈️", name: "Traveling", description: "Exploring new horizons" },
    { icon: "🎥", name: "Vlogging", description: "Sharing stories and experiences" }
  ];

  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with Social Icons */}
        <div className="flex items-center justify-between mb-16">
          {/* GitHub Icon - Left Side */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="flex-shrink-0"
          >
            <a
              href="https://github.com/torrey1233"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-28 h-28 rounded-full bg-gray-200 overflow-hidden shadow-lg relative group border-4 border-gray-300"
            >
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <FaGithub className="text-4xl text-gray-700 group-hover:text-blue-500 transition-colors duration-500" />
              </div>
            </a>
          </motion.div>
          {/* Center Title */}
          <motion.div
            className="flex-1 text-center max-w-2xl"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <motion.h1
              className="text-6xl font-bold text-gray-800 mb-4"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
            >
              Torrey Liu
            </motion.h1>
            <motion.p
              className="text-gray-700/80 text-lg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Computer Science Student • Data Engineer • Creative Technologist
            </motion.p>
          </motion.div>
          {/* LinkedIn Icon - Right Side */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="flex-shrink-0"
          >
            <a
              href="https://linkedin.com/in/torreyliu"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-28 h-28 rounded-full bg-blue-500 overflow-hidden shadow-lg relative group border-4 border-blue-500"
              style={{ animationDelay: '1.5s' }}
            >
              <div className="w-full h-full flex items-center justify-center bg-blue-500">
                <FaLinkedin className="text-4xl text-white group-hover:text-gray-800 transition-colors duration-500" />
              </div>
            </a>
          </motion.div>
        </div>
        {/* Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-cyan-300 font-bold text-3xl mb-8">Introduction</h2>
          <div className="bg-[#0a0a1a] text-white rounded-2xl shadow-lg border border-cyan-200 p-8">
            <p className="text-white text-lg">
              I am a 3rd-year Computer Science student at Carleton University, currently working as a Data Engineer Student Intern at Transport Canada. I'm passionate about building interactive digital tools that merge creativity, functionality, and user experience. From AI-integrated applications to immersive web apps, I'm always looking for opportunities to push the boundaries of what tech can do.
            </p>
            <p className="text-white text-lg mt-4">
              Outside of programming, I'm also a visual storyteller with a passion for photography, and I enjoy creative pursuits like music, vlogging, and exploring the world through travel and sports.
            </p>
          </div>
        </motion.div>
        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-cyan-300 font-bold text-3xl mb-8">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-blue-500 font-bold">
                      {exp.company}
                    </p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-gray-700/80">
                      {exp.period}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {exp.location}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, achievementIdx) => (
                    <li key={achievementIdx} className="flex items-start gap-3">
                      <span className="text-blue-500 text-sm mt-1">•</span>
                      <span className="text-gray-700/80">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Relevant Coursework Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-cyan-300 font-bold text-3xl mb-8">Relevant Coursework</h2>
          <div className="bg-[#0a0a1a] text-white rounded-2xl shadow-lg border border-cyan-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-md"
                >
                  <p className="text-black font-bold text-sm">
                    {course}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Hobbies & Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-cyan-300 font-bold text-3xl mb-8">Hobbies & Interests</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {hobbies.map((hobby, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-md group cursor-pointer"
              >
                <div className="text-4xl mb-3 group-hover:animate-pulse">
                  {hobby.icon}
                </div>
                <h3 className="text-blue-500 font-bold text-lg mb-2">
                  {hobby.name}
                </h3>
                <p className="text-gray-700/70 text-sm">
                  {hobby.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex gap-6 justify-center flex-wrap">
            <button 
              onClick={() => navigate('/projects')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-300"
            >
              View Projects
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-300" data-text="Download Resume">
              Download Resume
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const projects = [
  {
    title: 'WikiChess',
    description: 'A strategic multiplayer twist on WikiRacer that combines real-time Wikipedia navigation with turn-based gameplay and semantic guessing mechanics, challenging players to outmaneuver each other through both logic and deception.',
    link: 'https://devpost.com/software/wikichess',
    tech: ['Python', 'Flask', 'spaCy', 'Socket.IO', 'BeautifulSoup', 'HTML', 'CSS', 'JavaScript', 'Figma'],
    image: '/images/wikichess.jpg',
    isWinner: true
  },
  {
    title: 'GAIA: Generative AI Adventure',
    description: 'An immersive AI-powered text-to-video storytelling game where players shape narrative outcomes through dynamic choices interpreted and visualized in real time using generative AI.',
    link: 'https://devpost.com/software/gaia-lcnrqb',
    tech: ['Python', 'Flask', 'OpenAI API', 'Hailuo MiniMax API', 'HTML', 'CSS', 'JavaScript', 'Photoshop', 'multithreading'],
    image: '/images/gaia.jpg',
    isWinner: true
  },
  {
    title: "Torrey's Portfolio",
    description: 'This very site you\'re on — a stylish, cyberpunk-lite personal portfolio built to showcase my work, photography, and experience with an interactive and futuristic UI.',
    link: 'https://github.com/Torrey1233/TorreyPortfolioWebsite',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui', 'Vite'],
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=600&q=80',
    isWinner: false
  },
];

function Projects() {
  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-cyan-300 font-bold text-3xl mb-8">Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg h-full relative overflow-hidden">
                {/* Winner Label */}
                {project.isWinner && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">WINNER</span>
                  </div>
                )}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500 border-b-2 border-gray-200"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-500 mb-3 group-hover:text-gray-800 transition-all duration-300">
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{project.title}</a>
                  </h3>
                  <p className="text-gray-700/80 mb-4 leading-relaxed text-sm">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 font-bold border border-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function Resume() {
  const resumeUrl = '/Torrey_Liu_CS_Resume_Updated_2025.pdf';
  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-cyan-300 font-bold text-3xl mb-8">Resume</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <FaFilePdf className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Torrey Liu - Resume
              </h3>
              <p className="text-gray-700/80">
                Computer Science Student & Software Developer
              </p>
            </div>
            <div className="text-center mb-8 p-6 bg-gray-200 rounded-lg border-2 border-gray-300">
              <p className="text-blue-500 font-bold text-lg mb-4">
                📄 Resume Available for Download
              </p>
              <p className="text-gray-700 text-sm mb-4">
                Click the button below to download and view my resume
              </p>
              <p className="text-gray-600 text-xs">
                Includes: Education, Experience, Skills, Projects
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <a
              href={resumeUrl}
              download
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors duration-300"
              data-text="Download PDF"
            >
              Download PDF
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

const photographyImages = [
  // Street Photography
  { 
    src: '/images/DSC00041-1.jpg', 
    thumb: '/images/DSC00041-1.jpg', 
    alt: 'Urban Street Scene', 
    title: 'Downtown Pulse',
    category: 'street',
    lens: 'Sony 28-70mm F3.5',
    location: 'Downtown Ottawa',
    description: 'The heartbeat of the city',
    shortInfo: 'A vibrant street scene capturing the energy and rhythm of downtown life during golden hour.',
    exifData: null
  },
  { 
    src: '/images/DSC00094-2.jpg', 
    thumb: '/images/DSC00094-2.jpg', 
    alt: 'Modern Architecture', 
    title: 'Glass & Steel',
    category: 'street',
    lens: 'Sony 28-70mm F3.5',
    location: 'Ottawa, ON',
    description: 'Modern urban geometry',
    shortInfo: 'Contemporary architecture framed through clean geometric lines and reflective surfaces.',
    exifData: null
  },
  { 
    src: '/images/DSC00203-3.jpg', 
    thumb: '/images/DSC00203-3.jpg', 
    alt: 'Ultra-wide Urban View', 
    title: 'Urban Canyon',
    category: 'street',
    lens: 'TTartisan 10mm F2.0',
    location: 'Downtown Core',
    description: 'The city from above',
    shortInfo: 'An ultra-wide perspective revealing the dramatic scale and depth of urban architecture.',
    exifData: null
  },
  { 
    src: '/images/DSC00210-4.jpg', 
    thumb: '/images/DSC00210-4.jpg', 
    alt: 'Street Life Moment', 
    title: 'Sidewalk Stories',
    category: 'street',
    lens: 'Sony 28-70mm F3.5',
    location: 'City Center',
    description: 'Everyday urban narratives',
    shortInfo: 'Capturing the authentic moments and human stories that unfold on city sidewalks.',
    exifData: null
  },
  
  // Automotive Photography
  { 
    src: '/images/DSC01462-1.jpg', 
    thumb: '/images/DSC01462-1.jpg', 
    alt: 'Classic Car Detail', 
    title: 'Timeless Beauty',
    category: 'automotive',
    lens: 'Sony 28-70mm F3.5',
    location: 'Classic Car Show',
    description: 'Heritage automotive design',
    shortInfo: 'A close-up study of classic automotive design, highlighting the craftsmanship of a bygone era.',
    exifData: null
  },
  { 
    src: '/images/DSC01506-5-1.jpg', 
    thumb: '/images/DSC01506-5-1.jpg', 
    alt: 'Luxury Car Interior', 
    title: 'Cockpit Luxury',
    category: 'automotive',
    lens: 'Sony 28-70mm F3.5',
    location: 'Luxury Auto Show',
    description: 'Premium interior craftsmanship',
    shortInfo: 'Exploring the sophisticated details and premium materials of a high-end automotive interior.',
    exifData: null
  },
  { 
    src: '/images/DSC01510-9-2.jpg', 
    thumb: '/images/DSC01510-9-2.jpg', 
    alt: 'Sports Car Profile', 
    title: 'Speed Lines',
    category: 'automotive',
    lens: 'Sony 28-70mm F3.5',
    location: 'Performance Car Event',
    description: 'Aerodynamic perfection',
    shortInfo: 'The sleek profile of a performance vehicle, showcasing aerodynamic design and power.',
    exifData: null
  },
  { 
    src: '/images/DSC01556-1.jpg', 
    thumb: '/images/DSC01556-1.jpg', 
    alt: 'Modern Car Design', 
    title: 'Sculptural Form',
    category: 'automotive',
    lens: 'Sony 28-70mm F3.5',
    location: 'Auto Design Exhibition',
    description: 'Contemporary automotive art',
    shortInfo: 'Modern car design as sculpture, emphasizing flowing lines and dynamic proportions.',
    exifData: null
  },
  
  // Landscape & Nature
  { 
    src: '/images/DSC01606-2.jpg', 
    thumb: '/images/DSC01606-2.jpg', 
    alt: 'Natural Landscape', 
    title: 'Mountain Serenity',
    category: 'landscape',
    lens: 'TTartisan 10mm F2.0',
    location: 'Rocky Mountains',
    description: 'Alpine tranquility',
    shortInfo: 'A peaceful mountain landscape bathed in soft natural light, capturing nature\'s quiet majesty.',
    exifData: null
  },
  { 
    src: '/images/DSC01621-3.jpg', 
    thumb: '/images/DSC01621-3.jpg', 
    alt: 'Panoramic Vista', 
    title: 'Valley Vista',
    category: 'landscape',
    lens: 'Sony 28-70mm F3.5',
    location: 'Mountain Valley',
    description: 'Expansive natural beauty',
    shortInfo: 'A sweeping panoramic view of mountain valleys, showcasing the grandeur of natural landscapes.',
    exifData: null
  },
  { 
    src: '/images/DSC01660-4.jpg', 
    thumb: '/images/DSC01660-4.jpg', 
    alt: 'Lake Reflection', 
    title: 'Mirror Lake',
    category: 'landscape',
    lens: 'Sony 28-70mm F3.5',
    location: 'Alpine Lake',
    description: 'Perfect reflections',
    shortInfo: 'A pristine alpine lake creating perfect mirror-like reflections of the surrounding mountains.',
    exifData: null
  },
  { 
    src: '/images/DSC01690-5.jpg', 
    thumb: '/images/DSC01690-5.jpg', 
    alt: 'Forest Trail', 
    title: 'Forest Cathedral',
    category: 'landscape',
    lens: 'TTartisan 10mm F2.0',
    location: 'Old Growth Forest',
    description: 'Ancient woodland path',
    shortInfo: 'A mystical forest trail through towering trees, creating a natural cathedral of green.',
    exifData: null
  },
  
  // Portrait & People
  { 
    src: '/images/DSC01734-1.jpg', 
    thumb: '/images/DSC01734-1.jpg', 
    alt: 'Studio Portrait', 
    title: 'Inner Light',
    category: 'portrait',
    lens: 'Sony 28-70mm F3.5',
    location: 'Professional Studio',
    description: 'Expressive human spirit',
    shortInfo: 'A studio portrait that captures the subject\'s inner light and authentic personality.',
    exifData: null
  },
  { 
    src: '/images/DSC01753-2.jpg', 
    thumb: '/images/DSC01753-2.jpg', 
    alt: 'Street Portrait', 
    title: 'Urban Character',
    category: 'portrait',
    lens: 'Sony 28-70mm F3.5',
    location: 'City Streets',
    description: 'Street character study',
    shortInfo: 'A candid street portrait revealing the unique character and story of an urban dweller.',
    exifData: null
  },
  { 
    src: '/images/DSC01802-3.jpg', 
    thumb: '/images/DSC01802-3.jpg', 
    alt: 'Environmental Portrait', 
    title: 'Life in Context',
    category: 'portrait',
    lens: 'Sony 28-70mm F3.5',
    location: 'Urban Environment',
    description: 'People in their world',
    shortInfo: 'An environmental portrait that tells a story through the subject\'s interaction with their surroundings.',
    exifData: null
  },
  { 
    src: '/images/DSC01824-4.jpg', 
    thumb: '/images/DSC01824-4.jpg', 
    alt: 'Street Photography', 
    title: 'City Soul',
    category: 'portrait',
    lens: 'Sony 28-70mm F3.5',
    location: 'Downtown Streets',
    description: 'Urban soul captured',
    shortInfo: 'Street photography that captures the essence and soul of city life through human subjects.',
    exifData: null
  },
  
  // Abstract & Creative
  { 
    src: '/images/DSC02244-1.jpg', 
    thumb: '/images/DSC02244-1.jpg', 
    alt: 'Abstract Urban Art', 
    title: 'Urban Geometry',
    category: 'abstract',
    lens: 'TTartisan 10mm F2.0',
    location: 'Urban Art District',
    description: 'Abstract urban patterns',
    shortInfo: 'An abstract composition exploring the geometric patterns and textures found in urban environments.',
    exifData: null
  },
  { 
    src: '/images/DSC02291-1.jpg', 
    thumb: '/images/DSC02291-1.jpg', 
    alt: 'Creative Perspective', 
    title: 'New Angles',
    category: 'abstract',
    lens: 'Sony 28-70mm F3.5',
    location: 'Creative District',
    description: 'Fresh perspectives',
    shortInfo: 'Exploring familiar urban spaces through fresh, creative angles and perspectives.',
    exifData: null
  },
  { 
    src: '/images/DSC02296-2.jpg', 
    thumb: '/images/DSC02296-2.jpg', 
    alt: 'Artistic Urban Scene', 
    title: 'Visual Poetry',
    category: 'abstract',
    lens: 'TTartisan 10mm F2.0',
    location: 'Artistic Quarter',
    description: 'Urban visual poetry',
    shortInfo: 'Transforming urban scenes into artistic compositions that tell visual stories through abstraction.',
    exifData: null
  },
  
  // New Photos - July 2025
  { 
    src: '/images/20250726-00065-65.jpg', 
    thumb: '/images/20250726-00065-65.jpg', 
    alt: 'New Photography', 
    title: 'Summer Light',
    category: 'landscape',
    lens: 'Sony 28-70mm F3.5',
    location: 'Summer 2025',
    description: 'Capturing summer moments',
    shortInfo: 'A fresh perspective on summer landscapes, showcasing the unique quality of light during this season.',
    exifData: null
  },
  { 
    src: '/images/20250726-00038-38.jpg', 
    thumb: '/images/20250726-00038-38.jpg', 
    alt: 'New Photography', 
    title: 'Urban Discovery',
    category: 'street',
    lens: 'Sony 28-70mm F3.5',
    location: 'City Exploration',
    description: 'New urban perspectives',
    shortInfo: 'Exploring fresh urban angles and discovering new perspectives in familiar cityscapes.',
    exifData: null
  },
  { 
    src: '/images/20250726-00014-14.jpg', 
    thumb: '/images/20250726-00014-14.jpg', 
    alt: 'New Photography', 
    title: 'Natural Moments',
    category: 'landscape',
    lens: 'TTartisan 10mm F2.0',
    location: 'Nature Walk',
    description: 'Natural beauty captured',
    shortInfo: 'An ultra-wide perspective capturing the expansive beauty of natural landscapes.',
    exifData: null
  },
  { 
    src: '/images/20250726-00011-11.jpg', 
    thumb: '/images/20250726-00011-11.jpg', 
    alt: 'New Photography', 
    title: 'Street Stories',
    category: 'street',
    lens: 'Sony 28-70mm F3.5',
    location: 'Urban Streets',
    description: 'Contemporary street life',
    shortInfo: 'Documenting the pulse of modern urban life through candid street photography.',
    exifData: null
  },
  { 
    src: '/images/20250725-00005-5.jpg', 
    thumb: '/images/20250725-00005-5.jpg', 
    alt: 'New Photography', 
    title: 'Creative Vision',
    category: 'abstract',
    lens: 'TTartisan 10mm F2.0',
    location: 'Creative Exploration',
    description: 'Experimental photography',
    shortInfo: 'Pushing creative boundaries with experimental compositions and unique perspectives.',
    exifData: null
  }
];

const categories = [
  { id: 'all', name: 'All Photos', count: photographyImages.length },
  { id: 'street', name: 'Street Photography', count: photographyImages.filter(img => img.category === 'street').length },
  { id: 'automotive', name: 'Automotive', count: photographyImages.filter(img => img.category === 'automotive').length },
  { id: 'landscape', name: 'Landscape & Nature', count: photographyImages.filter(img => img.category === 'landscape').length },
  { id: 'portrait', name: 'Portrait & People', count: photographyImages.filter(img => img.category === 'portrait').length },
  { id: 'abstract', name: 'Abstract & Creative', count: photographyImages.filter(img => img.category === 'abstract').length }
];

// Helper function to extract EXIF data from images
const extractEXIFData = (imageSrc) => {
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(imageSrc);
      const arrayBuffer = await response.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer);
      
      console.log('EXIF data for', imageSrc, ':', JSON.stringify(tags, null, 2));
      resolve(tags);
    } catch (error) {
      console.log('Error extracting EXIF data for', imageSrc, ':', error);
      resolve(null);
    }
  });
};

// Helper function to format EXIF data for display
const formatEXIFData = (exifData) => {
  if (!exifData) return null;
  
  console.log('Formatting EXIF data:', JSON.stringify(exifData, null, 2));
  console.log('Available EXIF tags:', Object.keys(exifData));
  
  // The exifreader library puts all tags at the top level, not nested under 'Exif' or 'Image'
  const formatted = {
    date: exifData['DateTime']?.description ? 
      new Date(exifData['DateTime'].description.replace(/(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')).toLocaleDateString() : 
      exifData['DateTimeOriginal']?.description ? 
      new Date(exifData['DateTimeOriginal'].description.replace(/(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3')).toLocaleDateString() : null,
    shutterSpeed: exifData['ExposureTime']?.description || 
                 exifData['ShutterSpeedValue']?.description || null,
    aperture: exifData['FNumber']?.description || 
              exifData['ApertureValue']?.description || null,
    iso: exifData['ISOSpeedRatings']?.description ? 
         `ISO ${exifData['ISOSpeedRatings'].description}` :
         exifData['ISO']?.description ? 
         `ISO ${exifData['ISO'].description}` : null,
    lens: exifData['LensModel']?.description || 
          exifData['LensSpecification']?.description ||
          exifData['Lens']?.description || null,
    camera: exifData['Model']?.description || 
            exifData['Make']?.description || null,
    focalLength: exifData['FocalLength']?.description ? 
                 exifData['FocalLength'].description :
                 exifData['FocalLengthIn35mmFilm']?.description ? 
                 exifData['FocalLengthIn35mmFilm'].description : null
  };
  
  console.log('Formatted EXIF data:', JSON.stringify(formatted, null, 2));
  
  // Check if this image has any camera settings
  const hasCameraData = formatted.date || formatted.shutterSpeed || formatted.aperture || formatted.iso || formatted.lens || formatted.camera || formatted.focalLength;
  if (hasCameraData) {
    console.log('✅ This image HAS camera settings!');
  } else {
    console.log('❌ This image has NO camera settings');
  }
  
  return formatted;
};

function Photography() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showGear, setShowGear] = useState(false);
  const [imagesWithEXIF, setImagesWithEXIF] = useState(photographyImages);

  const filteredImages = selectedCategory === 'all' 
    ? imagesWithEXIF 
    : imagesWithEXIF.filter(img => img.category === selectedCategory);

  // Load EXIF data for all images
  useEffect(() => {
    const loadEXIFData = async () => {
      console.log('Starting EXIF data extraction...');
      
      // Test with just one image first
      const testImage = photographyImages[0];
      console.log('Testing with first image:', testImage.src);
      
      try {
        const testExif = await extractEXIFData(testImage.src);
        console.log('Test EXIF result:', testExif);
      } catch (error) {
        console.log('Test EXIF error:', error);
      }
      
      const updatedImages = await Promise.all(
        photographyImages.map(async (image, index) => {
          try {
            console.log(`Loading EXIF for image ${index + 1}:`, image.src);
            const exifData = await extractEXIFData(image.src);
            const formattedData = formatEXIFData(exifData);
            console.log(`EXIF result for ${image.src}:`, formattedData);
            return {
              ...image,
              exifData: formattedData
            };
          } catch (error) {
            console.log(`Could not load EXIF data for ${image.src}:`, error);
            return image;
          }
        })
      );
      console.log('All images processed:', updatedImages);
      setImagesWithEXIF(updatedImages);
    };

    loadEXIFData();
  }, []);

  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-6 font-playfair">
            Photography Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-inter">
            Capturing moments through the lens with a passion for visual storytelling. 
            From urban landscapes to intimate portraits, each image tells a unique story.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 font-inter ${
                  selectedCategory === category.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gear Section - Collapsible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowGear(!showGear)}
              className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
            >
              <div>
                <h3 className="text-2xl font-bold text-gray-800 font-playfair">
                  Photography Gear
                </h3>
                <p className="text-gray-600 mt-1 font-inter">
                  Equipment used to capture these moments
                </p>
              </div>
              <div className={`transform transition-transform duration-300 ${showGear ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            {showGear && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-8 pb-6 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 font-inter">Cameras</h4>
                    <ul className="space-y-2 text-gray-600 font-inter">
                      <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span><strong>Sony A7 IV</strong> - Full-frame mirrorless</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span><strong>Canon 80D</strong> - Reliable DSLR</span>
                      </li>
          </ul>
        </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3 font-inter">Lenses</h4>
                    <ul className="space-y-2 text-gray-600 font-inter">
                      <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span><strong>Sony 28-70mm F3.5</strong> - Versatile zoom</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span><strong>TTartisan 10mm F2.0</strong> - Ultra-wide</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span><strong>Canon 18-135mm F3.5</strong> - All-purpose</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Photography Grid - Masonry Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="photography-masonry columns-1 md:columns-2 lg:columns-3 xl:columns-4"
        >
          {filteredImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="photography-card group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={image.thumb}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-500 flex items-end">
                    <div className="p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-bold mb-2 font-playfair">
                      {image.title}
                    </h3>
                      <p className="text-sm text-gray-200 mb-3 font-inter">
                        {image.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-300 font-inter">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          {image.lens}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {image.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2 font-playfair">
              No photos in this category
            </h3>
            <p className="text-gray-500 font-inter">
              Check back soon for new additions to this collection.
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full bg-white rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Image Section - Left Side */}
                <div className="relative lg:w-2/3">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                    className="w-full h-auto max-h-[80vh] object-contain"
              />
                  
                  {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-300"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
                
                {/* Info Section - Right Side */}
                <div className="lg:w-1/3 p-8 bg-gray-50 border-l border-gray-200">
                  {/* Title - Commented out for future use */}
                  {/* <h3 className="text-3xl font-bold text-gray-800 mb-6 font-playfair">
                  {selectedImage.title}
                </h3> */}
                  
                                     {/* Date */}
                   <div className="mb-6">
                     <div className="flex items-center gap-2 mb-2">
                       <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                       <span className="text-sm font-semibold text-gray-700 font-inter">Date</span>
                     </div>
                     <p className="text-gray-600 font-inter">
                       {selectedImage.exifData?.date || 'Date not available'}
                     </p>
                   </div>
                  
                  {/* Short Info - Commented out for future use */}
                  {/* <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700 font-inter">About This Photo</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-inter">
                      {selectedImage.shortInfo}
                    </p>
                  </div> */}
                  
                                     {/* Camera Settings */}
                   <div className="mb-6">
                     <div className="flex items-center gap-2 mb-3">
                       <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                       <span className="text-sm font-semibold text-gray-700 font-inter">Camera Settings</span>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-600 font-inter">Shutter Speed:</span>
                         <span className="text-sm font-semibold text-gray-800 font-inter">
                           {selectedImage.exifData?.shutterSpeed || 'Not available'}
                         </span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-600 font-inter">Aperture:</span>
                         <span className="text-sm font-semibold text-gray-800 font-inter">
                           {selectedImage.exifData?.aperture || 'Not available'}
                         </span>
                       </div>
                       <div className="flex justify-between items-center">
                         <span className="text-sm text-gray-600 font-inter">ISO:</span>
                         <span className="text-sm font-semibold text-gray-800 font-inter">
                           {selectedImage.exifData?.iso || 'Not available'}
                         </span>
                       </div>
                       {selectedImage.exifData?.focalLength && (
                         <div className="flex justify-between items-center">
                           <span className="text-sm text-gray-600 font-inter">Focal Length:</span>
                           <span className="text-sm font-semibold text-gray-800 font-inter">{selectedImage.exifData.focalLength}</span>
                         </div>
                       )}
                     </div>
                   </div>
                  
                  {/* Equipment & Location */}
                  <div className="space-y-4">
                                         <div>
                       <div className="flex items-center gap-2 mb-2">
                         <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                         <span className="text-sm font-semibold text-gray-700 font-inter">Lens</span>
                       </div>
                       <p className="text-gray-600 text-sm font-inter">{selectedImage.exifData?.lens || selectedImage.lens}</p>
                     </div>
                    
                                         {selectedImage.exifData?.camera && (
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                           <span className="text-sm font-semibold text-gray-700 font-inter">Camera</span>
                         </div>
                         <p className="text-gray-600 text-sm font-inter">{selectedImage.exifData.camera}</p>
                       </div>
                     )}
                     {/* Location - Commented out for future use */}
                     {/* <div>
                       <div className="flex items-center gap-2 mb-2">
                         <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                         </svg>
                         <span className="text-sm font-semibold text-gray-700 font-inter">Location</span>
                       </div>
                       <p className="text-gray-600 text-sm font-inter">{selectedImage.location}</p>
                     </div> */}
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700 font-inter">Category</span>
                      </div>
                      <p className="text-gray-600 text-sm font-inter">{categories.find(c => c.id === selectedImage.category)?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Home() {
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "About",
      description: "Learn about my background, experience, and what drives me as a developer.",
      path: "/",
      icon: "👨‍💻"
    },
    {
      title: "Projects", 
      description: "Explore my technical projects including WikiChess, GAIA, and more.",
      path: "/projects",
      icon: "🚀"
    },
    {
      title: "Resume",
      description: "Download my professional resume with detailed experience and skills.",
      path: "/resume", 
      icon: "📄"
    },
    {
      title: "Photography",
      description: "View my photography portfolio showcasing creative visual storytelling.",
      path: "/photography",
      icon: "📷"
    }
  ];

  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-6xl font-bold text-gray-800 mb-4"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          >
            Welcome to My Portfolio
          </motion.h1>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#0a0a1a] text-white rounded-2xl shadow-lg border border-cyan-200 p-8 cursor-pointer group"
              onClick={() => navigate(section.path)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-4xl mb-4 group-hover:animate-pulse">
                {section.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-cyan-300 group-hover:text-pink-400 transition-colors duration-300">
                {section.title}
              </h3>
              <p>
                {section.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen cyber-bg relative overflow-x-hidden">
        <div className="noise-overlay" />
        <div className="relative z-10">
          <SynthwaveNav />
          <main>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/photography" element={<Photography />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
