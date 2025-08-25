// Photography Metadata Management System
// This file centralizes all photo information, categories, and blog posts

export const photoCategories = {
  street: {
    id: 'street',
    name: 'Street Photography',
    description: 'Urban scenes and street life',
    icon: '🏙️'
  },
  automotive: {
    id: 'automotive', 
    name: 'Automotive',
    description: 'Car shows and vehicle photography',
    icon: '🚗'
  },
  astro: {
    id: 'astro',
    name: 'Astrophotography', 
    description: 'Night sky and celestial photography',
    icon: '🌌'
  },
  concerts: {
    id: 'concerts',
    name: 'Concerts',
    description: 'Live music and performance photography',
    icon: '🎵'
  }
};

// Individual photo metadata - CORRECTED based on actual file locations
export const photoMetadata = {
  // Street Photography (files actually in street folder)
  'DSC00041-1.jpg': {
    title: 'Downtown Pulse',
    category: 'street',
    date: '2025-07-26',
    location: 'Downtown Ottawa',
    description: 'The heartbeat of the city during golden hour',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/125s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '35mm'
    },
    tags: ['urban', 'golden-hour', 'architecture'],
    featured: false
  },
  
  'DSC00094-2.jpg': {
    title: 'Glass & Steel',
    category: 'street',
    date: '2025-07-26',
    location: 'Ottawa, ON',
    description: 'Modern urban geometry and reflections',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/200s',
      aperture: 'f/8',
      iso: '100',
      focalLength: '50mm'
    },
    tags: ['architecture', 'reflections', 'modern'],
    featured: false
  },

  'DSC00203-3.jpg': {
    title: 'Urban Canyon',
    category: 'street',
    date: '2025-07-26',
    location: 'Downtown Ottawa',
    description: 'The towering buildings create natural canyons in the city',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/160s',
      aperture: 'f/6.3',
      iso: '100',
      focalLength: '28mm'
    },
    tags: ['urban', 'architecture', 'cityscape'],
    featured: false
  },

  'DSC00210-4.jpg': {
    title: 'Sidewalk Stories',
    category: 'street',
    date: '2025-07-26',
    location: 'Downtown Ottawa',
    description: 'Every sidewalk tells a story of urban life',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '40mm'
    },
    tags: ['street', 'urban', 'life'],
    featured: false
  },

  // Additional photos in street folder (miscategorized)
  'DSC01606-2.jpg': {
    title: 'Mountain Serenity',
    category: 'street', // Actually in street folder
    date: '2025-05-20',
    location: 'Rocky Mountains',
    description: 'Alpine tranquility under the stars',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '30s',
      aperture: 'f/2.0',
      iso: '3200',
      focalLength: '10mm'
    },
    tags: ['night-sky', 'mountains', 'long-exposure'],
    featured: true
  },

  'DSC01621-3.jpg': {
    title: 'Valley Vista',
    category: 'street', // Actually in street folder
    date: '2025-05-20',
    location: 'Rocky Mountains',
    description: 'Starry night over mountain valleys',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '25s',
      aperture: 'f/2.0',
      iso: '3200',
      focalLength: '10mm'
    },
    tags: ['night-sky', 'valley', 'stars'],
    featured: false
  },

  'DSC01660-4.jpg': {
    title: 'Mirror Lake',
    category: 'street', // Actually in street folder
    date: '2025-05-20',
    location: 'Rocky Mountains',
    description: 'Starry reflections in alpine lakes',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '30s',
      aperture: 'f/2.0',
      iso: '3200',
      focalLength: '10mm'
    },
    tags: ['reflections', 'lake', 'stars'],
    featured: false
  },

  'DSC01690-5.jpg': {
    title: 'Forest Cathedral',
    category: 'street', // Actually in street folder
    date: '2025-05-20',
    location: 'Rocky Mountains',
    description: 'Starry sky through forest canopy',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '20s',
      aperture: 'f/2.0',
      iso: '3200',
      focalLength: '10mm'
    },
    tags: ['forest', 'stars', 'canopy'],
    featured: false
  },

  // Automotive Photography (files actually in automotive folder)
  'DSC01556-1.jpg': {
    title: 'Sculptural Form',
    category: 'automotive',
    date: '2025-06-15',
    location: 'Classic Car Show',
    description: 'Sculptural beauty in automotive design',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/60s',
      aperture: 'f/4',
      iso: '200',
      focalLength: '40mm'
    },
    tags: ['sculptural', 'design', 'beauty'],
    featured: false
  },

  // Additional photos in automotive folder (miscategorized)
  'DSC01824-4.jpg': {
    title: 'City Soul',
    category: 'automotive', // Actually in automotive folder
    date: '2025-03-25',
    location: 'Live Music Venue',
    description: 'The soul of the city through music',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '35mm'
    },
    tags: ['city', 'soul', 'music'],
    featured: false
  },

  'DSC01802-3.jpg': {
    title: 'Life in Context',
    category: 'automotive', // Actually in automotive folder
    date: '2025-03-25',
    location: 'Live Music Venue',
    description: 'Life in context of live music',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['life', 'context', 'music'],
    featured: false
  },

  'DSC01753-2.jpg': {
    title: 'Urban Character',
    category: 'automotive', // Actually in automotive folder
    date: '2025-03-25',
    location: 'Live Music Venue',
    description: 'Urban character in concert photography',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '40mm'
    },
    tags: ['urban', 'character', 'concerts'],
    featured: false
  },

  'DSC01734-1.jpg': {
    title: 'Inner Light',
    category: 'automotive', // Actually in automotive folder
    date: '2025-03-25',
    location: 'Live Music Venue',
    description: 'Capturing the energy of live performance',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['live-music', 'performance', 'energy'],
    featured: false
  },

  // Astrophotography (files actually in astro folder)
  '20250725-00005-5.jpg': {
    title: 'Creative Vision',
    category: 'astro',
    date: '2025-07-25',
    location: 'Downtown Ottawa',
    description: 'Creative vision in urban photography',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '35mm'
    },
    tags: ['creative', 'vision', 'urban'],
    featured: false
  },

  '20250726-00011-11.jpg': {
    title: 'Street Stories',
    category: 'astro', // Actually in astro folder
    date: '2025-07-26',
    location: 'Downtown Ottawa',
    description: 'Capturing the stories that unfold on city streets',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '50mm'
    },
    tags: ['street', 'stories', 'urban'],
    featured: false
  },

  '20250726-00014-14.jpg': {
    title: 'Natural Moments',
    category: 'astro',
    date: '2025-07-26',
    location: 'Rocky Mountains',
    description: 'Natural moments in wilderness',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/8',
      iso: '100',
      focalLength: '10mm'
    },
    tags: ['natural', 'wilderness', 'moments'],
    featured: false
  },

  '20250726-00038-38.jpg': {
    title: 'Urban Discovery',
    category: 'astro', // Actually in astro folder
    date: '2025-07-26',
    location: 'Downtown Ottawa',
    description: 'Discovering hidden beauty in urban environments',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/125s',
      aperture: 'f/5.6',
      iso: '100',
      focalLength: '35mm'
    },
    tags: ['urban', 'discovery', 'street'],
    featured: false
  },

  '20250726-00065-65.jpg': {
    title: 'Summer Light',
    category: 'astro',
    date: '2025-07-26',
    location: 'Rocky Mountains',
    description: 'Summer light in natural landscapes',
    camera: 'Sony A7 IV',
    lens: 'TTartisan 10mm F2.0',
    settings: {
      shutterSpeed: '1/60s',
      aperture: 'f/8',
      iso: '100',
      focalLength: '10mm'
    },
    tags: ['summer', 'light', 'landscape'],
    featured: false
  },

  'DSC02244-1.jpg': {
    title: 'Urban Geometry',
    category: 'astro', // Actually in astro folder
    date: '2025-02-15',
    location: 'Downtown Ottawa',
    description: 'Geometric patterns in urban architecture',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/200s',
      aperture: 'f/8',
      iso: '100',
      focalLength: '35mm'
    },
    tags: ['geometry', 'architecture', 'urban'],
    featured: false
  },

  'DSC01506-5-1.jpg': {
    title: 'Cockpit Luxury',
    category: 'astro', // Actually in astro folder
    date: '2025-06-15',
    location: 'Classic Car Show',
    description: 'The luxurious interior of classic automobiles',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/4',
      iso: '200',
      focalLength: '50mm'
    },
    tags: ['luxury', 'interior', 'classic'],
    featured: false
  },

  'DSC01510-9-2.jpg': {
    title: 'Speed Lines',
    category: 'astro', // Actually in astro folder
    date: '2025-06-15',
    location: 'Classic Car Show',
    description: 'Dynamic lines and curves of automotive design',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/5.6',
      iso: '200',
      focalLength: '35mm'
    },
    tags: ['speed', 'design', 'dynamic'],
    featured: false
  },

  // Concert Photos (files actually in concerts folder)
  '20250809-00016-16.jpg': {
    title: 'Live Performance',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Capturing the energy of live performance',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['live-music', 'performance', 'energy'],
    featured: false
  },

  '20250809-00024-24.jpg': {
    title: 'Stage Presence',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'The commanding presence of live performers',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '40mm'
    },
    tags: ['stage', 'presence', 'performance'],
    featured: false
  },

  '20250809-00028-28.jpg': {
    title: 'Musical Moments',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Intimate moments in live music',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['music', 'moments', 'intimate'],
    featured: false
  },

  '20250809-00030-30.jpg': {
    title: 'Concert Energy',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'The raw energy of live concerts',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '35mm'
    },
    tags: ['energy', 'concerts', 'live'],
    featured: false
  },

  '20250809-00032-32.jpg': {
    title: 'Stage Lights',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Dramatic lighting in concert photography',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['lights', 'dramatic', 'stage'],
    featured: false
  },

  '20250809-00038-38.jpg': {
    title: 'Performance Art',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Artistic moments in live performance',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '40mm'
    },
    tags: ['art', 'performance', 'creative'],
    featured: false
  },

  '20250809-00044-44.jpg': {
    title: 'Live Connection',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'The connection between artist and audience',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['connection', 'artist', 'audience'],
    featured: false
  },

  '20250809-00054-54.jpg': {
    title: 'Concert Atmosphere',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'The electric atmosphere of live concerts',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '35mm'
    },
    tags: ['atmosphere', 'electric', 'concerts'],
    featured: false
  },

  '20250809-00057-57.jpg': {
    title: 'Stage Dynamics',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Dynamic movement on stage',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
    tags: ['dynamics', 'movement', 'stage'],
    featured: false
  },

  '20250809-00063-63.jpg': {
    title: 'Live Emotion',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'Emotional moments in live performance',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/80s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '40mm'
    },
    tags: ['emotion', 'live', 'performance'],
    featured: false
  },

  '20250809-00064-64.jpg': {
    title: 'Concert Magic',
    category: 'concerts',
    date: '2025-08-09',
    location: 'Live Music Venue',
    description: 'The magic of live music performance',
    camera: 'Sony A7 IV',
    lens: 'Sony 28-70mm F3.5',
    settings: {
      shutterSpeed: '1/100s',
      aperture: 'f/3.5',
      iso: '1600',
      focalLength: '50mm'
    },
          tags: ['magic', 'music', 'live'],
      featured: false
    },


  };

// Blog posts with grouped photos
export const blogPosts = {
  'aurora-june-2-2025': {
    id: 'aurora-june-2-2025',
    title: 'Aurora Borealis - June 2, 2025',
    date: '2025-06-02',
    description: 'A spectacular night capturing the northern lights in all their glory. The aurora danced across the sky in vibrant greens and purples, creating a magical display of nature\'s light show.',
    category: 'astro',
    tags: ['aurora', 'northern-lights', 'night-sky', 'astro'],
    featured: true,
    photos: [
      'DSC01502-1-1.jpg',
      'DSC01503-2-2.jpg',
      'DSC01504-3-3.jpg',
      'DSC01505-4-4.jpg',
      'DSC01506-5-5.jpg',
      'DSC01507-6-6.jpg',
      'DSC01508-7-7.jpg',
      'DSC01509-8-8.jpg',
      'DSC01510-9-9.jpg',
      'DSC01511-10-10.jpg',
      'DSC01512-11-11.jpg',
      'DSC01513-12-12.jpg',
      'DSC01514-13-13.jpg',
      'DSC01515-14-14.jpg',
      'DSC01516-15-15.jpg',
      'DSC01517-16-16.jpg',
      'DSC01518-17-17.jpg',
      'DSC01519-18-18.jpg',
      'DSC01520-19-19.jpg',
      'DSC01521-20-20.jpg',
      'DSC01522-21-21.jpg',
      'DSC01523-22-22.jpg',
      'DSC01525-23-23.jpg',
      'DSC01526-24-24.jpg',
      'DSC01527-25-25.jpg',
      'DSC01528-26-26.jpg',
      'DSC01529-27-27.jpg',
      'DSC01530-28-28.jpg'
    ],
    equipment: {
      camera: 'Sony A7 IV',
      lenses: ['TTartisan 10mm F2.0'],
      accessories: ['Sturdy Tripod', 'Remote Shutter', 'Star Tracker']
    },
    location: 'Northern Canada',
    weather: 'Clear night, perfect aurora conditions',
    notes: 'Incredible aurora activity with multiple displays throughout the night'
  },

  'stargazing-denholm-july-25-2025': {
    id: 'stargazing-denholm-july-25-2025',
    title: 'Stargazing in Denholm',
    date: '2025-07-25',
    description: 'A magical night under the stars in Denholm, capturing the beauty of the night sky and the tranquility of rural landscapes.',
    category: 'astro',
    tags: ['astro', 'night-sky', 'stars', 'rural'],
    featured: false,
    photos: [
      '20250725-00002-2.jpg',
      '20250725-00003-3.jpg',
      '20250725-00004-4.jpg',
      '20250725-00005-5.jpg',
      '20250725-00006-6.jpg',
      '20250726-00008-8.jpg',
      '20250726-00009-9.jpg',
      '20250726-00010-10.jpg',
      '20250726-00011-11.jpg',
      '20250726-00012-12.jpg',
      '20250726-00013-13.jpg',
      '20250726-00014-14.jpg',
      '20250726-00015-15.jpg',
      '20250726-00019-19.jpg',
      '20250726-00034-34.jpg',
      '20250726-00035-35.jpg',
      '20250726-00036-36.jpg',
      '20250726-00038-38.jpg',
      '20250726-00039-39.jpg',
      '20250726-00041-41.jpg',
      '20250726-00043-43.jpg',
      '20250726-00044-44.jpg',
      '20250726-00045-45.jpg',
      '20250726-00046-46.jpg',
      '20250726-00047-47.jpg',
      '20250726-00048-48.jpg',
      '20250726-00049-49.jpg',
      '20250726-00050-50.jpg',
      '20250726-00052-52.jpg',
      '20250726-00053-53.jpg',
      '20250726-00054-54.jpg',
      '20250726-00059-59.jpg',
      '20250726-00060-60.jpg',
      '20250726-00062-62.jpg',
      '20250726-00063-63.jpg',
      '20250726-00064-64.jpg',
      '20250726-00065-65.jpg',
      '20250726-00066-66.jpg',
      '20250726-00067-67.jpg',
      '20250726-00068-68.jpg',
      '20250726-00069-69.jpg',
      '20250726-00070-70.jpg',
      '20250726-00071-71.jpg',
      '20250726-00072-72.jpg',
      '20250727-00075-75.jpg',
      '20250727-00078-78.jpg',
      '20250727-00079-79.jpg',
      '20250727-00080-80.jpg',
      '20250727-00081-81.jpg',
      '20250727-00082-82.jpg',
      '20250727-00085-85.jpg',
      '20250727-00086-86.jpg',
      '20250727-00089-89.jpg',
      '20250727-00090-90.jpg',
      '20250727-00093-93.jpg'
    ],
    equipment: {
      camera: 'Sony A7 IV',
      lenses: ['TTartisan 10mm F2.0'],
      accessories: ['Sturdy Tripod', 'Remote Shutter', 'Star Tracker']
    },
    location: 'Denholm, Rural Area',
    weather: 'Clear night, no moon',
    notes: 'Perfect conditions for astrophotography with minimal light pollution'
  },

  'pomelo-soda-aug-9-2025': {
    id: 'pomelo-soda-aug-9-2025',
    title: 'Pomelo Soda Lights Up Avant-Garde Bar',
    date: '2025-08-09',
    description: 'Last night, downtown Ottawa came alive with an incredible lineup at Avant-Garde Bar. Local favourites Pomelo Soda delivered an electrifying performance, sharing the stage with the high-energy Beach Bats and the ever-groovy Mr. Mule.',
    category: 'concerts',
    tags: ['concerts', 'live-music', 'performance'],
    featured: true,
    photos: [
      '20250809-00001-1.jpg',
      '20250809-00002-2.jpg',
      '20250809-00003-3.jpg',
      '20250809-00004-4.jpg',
      '20250809-00005-5.jpg',
      '20250809-00006-6.jpg',
      '20250809-00007-7.jpg',
      '20250809-00008-8.jpg',
      '20250809-00009-9.jpg',
      '20250809-00010-10.jpg',
      '20250809-00011-11.jpg',
      '20250809-00012-12.jpg',
      '20250809-00013-13.jpg',
      '20250809-00014-14.jpg',
      '20250809-00015-15.jpg',
      '20250809-00016-16.jpg',
      '20250809-00017-17.jpg',
      '20250809-00018-18.jpg',
      '20250809-00019-19.jpg',
      '20250809-00020-20.jpg',
      '20250809-00021-21.jpg',
      '20250809-00022-22.jpg',
      '20250809-00023-23.jpg',
      '20250809-00024-24.jpg',
      '20250809-00025-25.jpg',
      '20250809-00026-26.jpg',
      '20250809-00027-27.jpg',
      '20250809-00028-28.jpg',
      '20250809-00029-29.jpg',
      '20250809-00030-30.jpg',
      '20250809-00031-31.jpg',
      '20250809-00032-32.jpg',
      '20250809-00033-33.jpg',
      '20250809-00034-34.jpg',
      '20250809-00035-35.jpg',
      '20250809-00036-36.jpg',
      '20250809-00037-37.jpg',
      '20250809-00038-38.jpg',
      '20250809-00039-39.jpg',
      '20250809-00040-40.jpg',
      '20250809-00041-41.jpg',
      '20250809-00042-42.jpg',
      '20250809-00043-43.jpg',
      '20250809-00044-44.jpg',
      '20250809-00045-45.jpg',
      '20250809-00046-46.jpg',
      '20250809-00047-47.jpg',
      '20250809-00048-48.jpg',
      '20250809-00049-49.jpg',
      '20250809-00050-50.jpg',
      '20250809-00051-51.jpg',
      '20250809-00052-52.jpg',
      '20250809-00053-53.jpg',
      '20250809-00054-54.jpg',
      '20250809-00055-55.jpg',
      '20250809-00056-56.jpg',
      '20250809-00057-57.jpg',
      '20250809-00058-58.jpg',
      '20250809-00059-59.jpg',
      '20250809-00060-60.jpg',
      '20250809-00061-61.jpg',
      '20250809-00062-62.jpg',
      '20250809-00063-63.jpg',
      '20250809-00064-64.jpg',
      '20250809-00065-65.jpg',
      '20250809-00066-66.jpg',
      '20250809-00067-67.jpg',
      '20250809-00068-68.jpg',
      '20250809-00069-69.jpg',
      '20250809-00070-70.jpg',
      '20250809-00071-71.jpg',
      '20250809-00072-72.jpg',
      '20250809-00073-73.jpg',
      '20250809-00074-74.jpg',
      '20250809-00075-75.jpg',
      '20250809-00076-76.jpg',
      '20250809-00077-77.jpg'
    ],
    equipment: {
      camera: 'Sony A7 IV',
      lenses: ['Sony 28-70mm F3.5'],
      accessories: ['Fast memory cards', 'Extra batteries']
    },
    location: 'Live Music Venue',
    weather: 'Indoor venue',
    notes: 'Excellent lighting and energy throughout the performance'
  }
};

// Helper functions for data management
export const getPhotosByCategory = (category) => {
  return Object.entries(photoMetadata)
    .filter(([filename, metadata]) => metadata.category === category && !metadata.blogPost)
    .map(([filename, metadata]) => ({
      filename,
      ...metadata
    }));
};

export const getPhotosByBlogPost = (blogPostId) => {
  const blogPost = blogPosts[blogPostId];
  if (!blogPost) return [];
  
  return blogPost.photos.map(filename => ({
    filename,
    ...photoMetadata[filename]
  }));
};

export const getAllPhotos = () => {
  return Object.entries(photoMetadata)
    .filter(([filename, metadata]) => !metadata.blogPost)
    .map(([filename, metadata]) => ({
      filename,
      ...metadata
    }));
};

export const getFeaturedPhotos = () => {
  return Object.entries(photoMetadata)
    .filter(([filename, metadata]) => metadata.featured && !metadata.blogPost)
    .map(([filename, metadata]) => ({
      filename,
      ...metadata
    }));
};

export const getBlogPostsByCategory = (category) => {
  return Object.values(blogPosts)
    .filter(post => post.category === category);
};
