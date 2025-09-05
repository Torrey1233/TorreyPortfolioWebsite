import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import new components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import SpotlightCard from './components/SpotlightCard';
import Footer from './components/Footer';

// Import existing components (keeping them for now)
import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Photography from './components/Photography';
import AdminDashboard from './components/admin/AdminDashboard';

// Sample data for the mixed grid
const spotlightData = [
  // CS Projects
  {
    id: 'wikichess',
    title: 'WikiChess',
    description: 'A strategic multiplayer twist on WikiRacer that combines real-time Wikipedia navigation with turn-based gameplay and semantic guessing mechanics.',
    image: '/images/wikichess.jpg',
    tech: ['Python', 'Flask', 'spaCy', 'Socket.IO', 'BeautifulSoup'],
    isWinner: true,
    type: 'project'
  },
  {
    id: 'gaia',
    title: 'GAIA: Generative AI Adventure',
    description: 'An immersive AI-powered text-to-video storytelling game where players shape narrative outcomes through dynamic choices interpreted and visualized in real time.',
    image: '/images/gaia.jpg',
    tech: ['Python', 'Flask', 'OpenAI API', 'Hailuo MiniMax API'],
    isWinner: true,
    type: 'project'
  },
  {
    id: 'portfolio',
    title: "Torrey's Portfolio",
    description: 'This very site — a cinematic, minimal artistic portfolio showcasing both CS projects and photography with modern design principles.',
    image: '/images/processed/street/DSC00041-1.jpg',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
    isWinner: false,
    type: 'project'
  },
  
  // Photography
  {
    id: 'street-1',
    title: 'Downtown Pulse',
    description: 'The heartbeat of the city during golden hour, capturing the energy and rhythm of urban life.',
    src: '/images/processed/street/DSC00041-1.jpg',
    category: 'Street',
    lens: 'Sony 28-70mm F3.5',
    location: 'Downtown Ottawa',
    type: 'photography'
  },
  {
    id: 'automotive-1',
    title: 'Sculptural Form',
    description: 'Modern car design as sculpture, emphasizing flowing lines and dynamic proportions.',
    src: '/images/processed/automotive/DSC01556-1.jpg',
    category: 'Automotive',
    lens: 'Sony 28-70mm F3.5',
    location: 'Auto Design Exhibition',
    type: 'photography'
  },
  {
    id: 'astro-1',
    title: 'Creative Vision',
    description: 'Pushing creative boundaries with experimental compositions and unique perspectives.',
    src: '/images/processed/astro/20250725-00005-5.jpg',
    category: 'Astro',
    lens: 'TTartisan 10mm F2.0',
    location: 'Creative Exploration',
    type: 'photography'
  },
  {
    id: 'concerts-1',
    title: 'Live Performance',
    description: 'Capturing the energy and emotion of live music performances.',
    src: '/images/processed/concerts/20250809-00016-16.jpg',
    category: 'Concerts',
    lens: 'Sony 28-70mm F3.5',
    location: 'Live Music Venue',
    type: 'photography'
  }
];

// New Homepage Component
const Homepage = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Spotlight Section */}
      <section className="section-spacing bg-primary-50">
        <div className="container-cinematic">
          {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
            <h2 className="text-headline mb-6 text-primary-900">
              Featured Work
            </h2>
            <p className="text-subtitle text-primary-600 max-w-3xl mx-auto">
              A curated selection of my technical projects and photographic explorations, 
              showcasing the intersection of creativity and technology.
          </p>
        </motion.div>

          {/* Mixed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlightData.map((item, index) => (
              <SpotlightCard
                key={item.id}
                item={item}
                type={item.type}
                index={index}
              />
            ))}
              </div>

          {/* View All CTA */}
              <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/projects"
                className="btn-primary"
              >
                View All Projects
              </a>
              <a
                href="/photography"
                className="btn-outline"
              >
                View All Photography
              </a>
          </div>
        </motion.div>
              </div>
      </section>

      {/* About Preview Section */}
      <section className="section-spacing">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            >
              <h2 className="text-headline mb-6 text-primary-900">
                Creative Technologist
                    </h2>
              <p className="text-body text-primary-600 mb-6">
                I am a 3rd-year Computer Science student at Carleton University, currently working as a Data Engineer Student Intern at Transport Canada. 
                I'm passionate about building interactive digital tools that merge creativity, functionality, and user experience.
              </p>
              <p className="text-body text-primary-600 mb-8">
                Outside of programming, I'm also a visual storyteller with a passion for photography, 
                and I enjoy creative pursuits like music, vlogging, and exploring the world through travel and sports.
              </p>
              <a
                href="/"
                className="btn-primary"
              >
                Learn More About Me
              </a>
                          </motion.div>

            {/* Image */}
          <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="/images/processed/street/DSC00094-2.jpg"
                  alt="Creative technologist at work"
                  className="w-full h-full object-cover"
                />
                        </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent-500 rounded-2xl opacity-20"></div>
            </motion.div>
        </div>
      </div>
    </section>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-16 lg:pt-20">
            <Routes>
            <Route path="/home" element={<Homepage />} />
              <Route path="/" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/photography" element={<Photography />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
