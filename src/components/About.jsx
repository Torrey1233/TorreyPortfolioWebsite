import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const About = () => {
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
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="section-spacing bg-primary-50">
        <div className="container-cinematic">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-display mb-6 text-primary-900">
              About Me
            </h1>
            <p className="text-subtitle text-primary-600 max-w-3xl mx-auto">
              Computer Science student passionate about building innovative digital solutions and capturing life through photography.
            </p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="card p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Social Icons */}
                <div className="flex gap-6">
                  <motion.a
                    href="https://github.com/torrey1233"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <FaGithub className="text-3xl text-primary-700 group-hover:text-accent-600 transition-colors duration-500" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com/in/torreyliu"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-full bg-accent-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <FaLinkedin className="text-3xl text-white group-hover:text-primary-900 transition-colors duration-500" />
                  </motion.a>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-headline mb-3 text-primary-900">
                    Torrey Liu
                  </h2>
                  <p className="text-subtitle text-primary-600 mb-4">
                    Computer Science Student • Data Engineer • Creative Technologist
                  </p>
                  <p className="text-body text-primary-700 leading-relaxed">
                    I am a 3rd-year Computer Science student at Carleton University, currently working as a Data Engineer Student Intern at Transport Canada. I'm passionate about building interactive digital tools that merge creativity, functionality, and user experience.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="section-spacing">
        <div className="container-cinematic">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-headline mb-8 text-primary-900">Introduction</h2>
            <div className="card p-8 bg-primary-900 text-white">
              <p className="text-body leading-relaxed mb-4">
                I am a 3rd-year Computer Science student at Carleton University, currently working as a Data Engineer Student Intern at Transport Canada. I'm passionate about building interactive digital tools that merge creativity, functionality, and user experience. From AI-integrated applications to immersive web apps, I'm always looking for opportunities to push the boundaries of what tech can do.
              </p>
              <p className="text-body leading-relaxed">
                Outside of programming, I'm also a visual storyteller with a passion for photography, and I enjoy creative pursuits like music, vlogging, and exploring the world through travel and sports.
              </p>
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-headline mb-8 text-primary-900">Experience</h2>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="card p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-title mb-1 text-primary-900">
                        {exp.title}
                      </h3>
                      <p className="text-subtitle text-accent-600 font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-body text-primary-700">
                        {exp.period}
                      </p>
                      <p className="text-caption text-primary-600">
                        {exp.location}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achievementIdx) => (
                      <li key={achievementIdx} className="flex items-start gap-3">
                        <span className="text-accent-500 text-sm mt-1">•</span>
                        <span className="text-body text-primary-700">
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-headline mb-8 text-primary-900">Relevant Coursework</h2>
            <div className="card p-8 bg-primary-900 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <p className="text-body font-semibold text-primary-900">
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-headline mb-8 text-primary-900">Hobbies & Interests</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {hobbies.map((hobby, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="card p-6 group cursor-pointer"
                >
                  <div className="text-4xl mb-3 group-hover:animate-pulse">
                    {hobby.icon}
                  </div>
                  <h3 className="text-subtitle font-semibold text-accent-600 mb-2">
                    {hobby.name}
                  </h3>
                  <p className="text-caption text-primary-700">
                    {hobby.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex gap-6 justify-center flex-wrap">
              <button 
                onClick={() => navigate('/projects')}
                className="btn-primary"
              >
                View Projects
              </button>
              <a
                href="/Torrey_Liu_CS_Resume_Updated_2025.pdf"
                download
                className="btn-outline"
              >
                Download Resume
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
