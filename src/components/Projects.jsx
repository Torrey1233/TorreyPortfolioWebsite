import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      title: 'WikiChess',
      description: 'A strategic multiplayer twist on WikiRacer that combines real-time Wikipedia navigation with turn-based gameplay and semantic guessing mechanics, challenging players to outmaneuver each other through both logic and deception.',
      link: 'https://devpost.com/software/wikichess',
      github: 'https://github.com/torrey1233/wikichess',
      tech: ['Python', 'Flask', 'spaCy', 'Socket.IO', 'BeautifulSoup', 'HTML', 'CSS', 'JavaScript', 'Figma'],
      image: '/images/wikichess.jpg',
      isWinner: true,
             challenge: 'Create an engaging multiplayer game that combines Wikipedia navigation with strategic gameplay',
       action: 'Developed a real-time web application using Python Flask backend with Socket.IO for live communication, integrated spaCy for semantic analysis, and created an intuitive UI with modern web technologies',
                               result: '<strong>Won Best Game Hack at Hack The 6ix 2024</strong>, created an innovative gaming experience that educates while entertaining'
    },
    {
      title: 'GAIA: Generative AI Adventure',
      description: 'An immersive AI-powered text-to-video storytelling game where players shape narrative outcomes through dynamic choices interpreted and visualized in real time using generative AI.',
      link: 'https://devpost.com/software/gaia-lcnrqb',
      github: 'https://github.com/torrey1233/gaia',
      tech: ['Python', 'Flask', 'OpenAI API', 'Hailuo MiniMax API', 'HTML', 'CSS', 'JavaScript', 'Photoshop', 'multithreading'],
      image: '/images/gaia.jpg',
      isWinner: true,
             challenge: 'Build an interactive storytelling platform that leverages AI to create dynamic, personalized narratives',
       action: 'Integrated multiple AI APIs for text generation and video creation, implemented multithreading for performance, and designed a responsive web interface for seamless user experience',
                               result: '<strong>Won Best Use of Gen AI at McHacks 12</strong>, created a unique AI-powered storytelling experience'
    },
    {
      title: "Torrey's Portfolio",
      description: 'This very site you\'re on — a cinematic, minimal artistic portfolio built to showcase my work, photography, and experience with an interactive and futuristic UI.',
      link: 'https://github.com/Torrey1233/TorreyPortfolioWebsite',
      github: 'https://github.com/Torrey1233/TorreyPortfolioWebsite',
      tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite', 'JavaScript'],
      image: '/images/processed/street/DSC00041-1.jpg',
      isWinner: false,
      challenge: 'Design a portfolio that showcases both technical projects and creative photography in a cohesive, modern way',
      action: 'Created a responsive React application with modern animations, optimized performance, and implemented accessibility best practices',
      result: 'A beautiful, fast, and accessible portfolio that effectively presents both technical and creative work'
    },
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
              Projects
            </h1>
            <p className="text-subtitle text-primary-600 max-w-3xl mx-auto">
              Explore my technical projects showcasing innovation in AI, web development, and creative problem-solving.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <div className="card h-full hover:shadow-xl transition-all duration-300">
                  {/* Winner Label */}
                  {project.isWinner && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        WINNER
                      </span>
                    </div>
                  )}
                  
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-title mb-3 text-accent-600 group-hover:text-primary-900 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-body text-primary-700 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full bg-primary-100 text-primary-700 font-medium border border-primary-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Challenge → Action → Result */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="text-caption font-semibold text-accent-600 mb-1">Challenge</h4>
                        <p className="text-caption text-primary-600">{project.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-caption font-semibold text-accent-600 mb-1">Action</h4>
                        <p className="text-caption text-primary-600">{project.action}</p>
                      </div>
                                             <div>
                         <h4 className="text-caption font-semibold text-accent-600 mb-1">Result</h4>
                         <p className="text-caption text-primary-600" dangerouslySetInnerHTML={{ __html: project.result }}></p>
                       </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors duration-300"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                        View Demo
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors duration-300"
                      >
                        <FaGithub className="text-sm" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Projects Section */}
      <section className="section-spacing">
        <div className="container-cinematic">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-headline mb-6 text-primary-900">
              More Projects Coming Soon
            </h2>
            <p className="text-subtitle text-primary-600 max-w-2xl mx-auto mb-8">
              I'm constantly working on new projects and learning new technologies. 
              Check back soon for more innovative solutions and creative applications.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <a
                href="https://github.com/torrey1233"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View GitHub
              </a>
              <a
                href="mailto:torreyliu2004@gmail.com"
                className="btn-outline"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
