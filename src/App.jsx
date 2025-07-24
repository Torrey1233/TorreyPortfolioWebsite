import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import { FaUser, FaProjectDiagram, FaFilePdf, FaCameraRetro, FaBars, FaGithub, FaLinkedin, FaTimes, FaHome, FaEnvelope } from 'react-icons/fa';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";

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
  { src: '/images/DSC00041-1.jpg', thumb: '/images/DSC00041-1.jpg', alt: 'DSC00041-1', title: 'DSC00041-1' },
  { src: '/images/DSC00094-2.jpg', thumb: '/images/DSC00094-2.jpg', alt: 'DSC00094-2', title: 'DSC00094-2' },
  { src: '/images/DSC00203-3.jpg', thumb: '/images/DSC00203-3.jpg', alt: 'DSC00203-3', title: 'DSC00203-3' },
  { src: '/images/DSC00210-4.jpg', thumb: '/images/DSC00210-4.jpg', alt: 'DSC00210-4', title: 'DSC00210-4' },
  { src: '/images/DSC01462-1.jpg', thumb: '/images/DSC01462-1.jpg', alt: 'DSC01462-1', title: 'DSC01462-1' },
  { src: '/images/DSC01506-5-1.jpg', thumb: '/images/DSC01506-5-1.jpg', alt: 'DSC01506-5-1', title: 'DSC01506-5-1' },
  { src: '/images/DSC01510-9-2.jpg', thumb: '/images/DSC01510-9-2.jpg', alt: 'DSC01510-9-2', title: 'DSC01510-9-2' },
  { src: '/images/DSC01556-1.jpg', thumb: '/images/DSC01556-1.jpg', alt: 'DSC01556-1', title: 'DSC01556-1' },
  { src: '/images/DSC01606-2.jpg', thumb: '/images/DSC01606-2.jpg', alt: 'DSC01606-2', title: 'DSC01606-2' },
  { src: '/images/DSC01621-3.jpg', thumb: '/images/DSC01621-3.jpg', alt: 'DSC01621-3', title: 'DSC01621-3' },
  { src: '/images/DSC01660-4.jpg', thumb: '/images/DSC01660-4.jpg', alt: 'DSC01660-4', title: 'DSC01660-4' },
  { src: '/images/DSC01690-5.jpg', thumb: '/images/DSC01690-5.jpg', alt: 'DSC01690-5', title: 'DSC01690-5' },
  { src: '/images/DSC01734-1.jpg', thumb: '/images/DSC01734-1.jpg', alt: 'DSC01734-1', title: 'DSC01734-1' },
  { src: '/images/DSC01753-2.jpg', thumb: '/images/DSC01753-2.jpg', alt: 'DSC01753-2', title: 'DSC01753-2' },
  { src: '/images/DSC01802-3.jpg', thumb: '/images/DSC01802-3.jpg', alt: 'DSC01802-3', title: 'DSC01802-3' },
  { src: '/images/DSC01824-4.jpg', thumb: '/images/DSC01824-4.jpg', alt: 'DSC01824-4', title: 'DSC01824-4' },
  { src: '/images/DSC02244-1.jpg', thumb: '/images/DSC02244-1.jpg', alt: 'DSC02244-1', title: 'DSC02244-1' },
  { src: '/images/DSC02291-1.jpg', thumb: '/images/DSC02291-1.jpg', alt: 'DSC02291-1', title: 'DSC02291-1' },
  { src: '/images/DSC02296-2.jpg', thumb: '/images/DSC02296-2.jpg', alt: 'DSC02296-2', title: 'DSC02296-2' },
  
];

function Photography() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <section className="min-h-screen pt-44 px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-cyan-300 font-bold text-3xl mb-8">Photography Portfolio</h2>
        <div className="bg-[#0a0a1a] text-white rounded-2xl shadow-lg border border-cyan-200 p-8">
          <p className="text-lg mb-4">I love experimenting with different gear to capture unique perspectives. Here’s what I use for my photography adventures:</p>
          <ul className="list-disc pl-6 space-y-1 text-base">
            <li><span className="font-bold text-cyan-300">Sony A7 IV</span> &mdash; Full-frame mirrorless</li>
            <li><span className="font-bold text-cyan-300">Sony 28mm-70mm F3.5</span> &mdash; Versatile zoom lens</li>
            <li><span className="font-bold text-cyan-300">TTartisan 10mm F2.0</span> &mdash; Ultra-wide for creative shots</li>
            <li><span className="font-bold text-cyan-300">Canon 80D</span> &mdash; Reliable DSLR</li>
            <li><span className="font-bold text-cyan-300">Canon 18-135mm F3.5</span> &mdash; All-purpose zoom</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photographyImages.map((image, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl">
                <div className="relative overflow-hidden">
                  <img
                    src={image.thumb}
                    alt={image.alt}
                    className="w-[400px] h-[260px] object-cover rounded-2xl shadow-[0_0_24px_#a259ff,0_0_48px_#00ffff] transition-transform duration-300 cursor-pointer group-hover:scale-105 group-hover:shadow-[0_0_48px_#ff2fd6,0_0_96px_#00ffff] border-b-2 border-gray-200"
                  />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-gray-800 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-[rgba(30,30,40,0.85)] rounded-3xl shadow-[0_0_48px_#00ffff,0_0_96px_#ff2fd6] border-2 border-pink-500 p-10 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-gray-300"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-300 text-3xl hover:text-blue-500 transition-colors duration-300"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl">
                  {selectedImage.title}
                </h3>
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
