# Torrey Liu - Creative Technologist Portfolio

A cinematic, minimal artistic portfolio showcasing both Computer Science projects and Photography. Built with modern web technologies and designed for performance, accessibility, and visual impact.

## ✨ Features

### 🎨 Design
- **Cinematic Hero Section**: Fullscreen background with dimmed/blurred photography overlay
- **Modern Typography**: Inter + Playfair Display font combination for editorial elegance
- **Minimal Aesthetic**: Clean, spacious design with thoughtful white space
- **Responsive Design**: Optimized for all devices and screen sizes

### 🚀 Performance
- **Fast Loading**: Optimized images with lazy loading and blur placeholders
- **Smooth Animations**: Framer Motion animations with reduced-motion support
- **Lighthouse Score**: Targeting 90+ performance score
- **SEO Optimized**: Proper metadata, OpenGraph images, and JSON-LD schema

### 📱 Accessibility
- **WCAG AA Compliant**: High contrast ratios and clear focus states
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user's motion preferences

### 🎯 Content
- **Mixed Grid Layout**: Alternating CS projects and photography in SpotlightCards
- **Project Case Studies**: Challenge → Action → Result format with detailed information
- **Photography Gallery**: Masonry layout with category filters and lightbox
- **Blog Integration**: Photography blog posts with expandable galleries

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Typography**: Inter + Playfair Display (Google Fonts)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Torrey1233/TorreyPortfolioWebsite.git
   cd TorreyPortfolioWebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.jsx   # Modern navigation with social links
│   ├── HeroSection.jsx  # Cinematic hero with background image
│   ├── SpotlightCard.jsx # Mixed grid cards for projects/photos
│   ├── About.jsx        # About page with experience & skills
│   ├── Projects.jsx     # Project showcase with case studies
│   ├── Photography.jsx  # Gallery with filters & lightbox
│   ├── Resume.jsx       # Resume download & preview
│   └── Footer.jsx       # Footer with social links
├── data/
│   └── photography-data.js # Photo metadata & blog posts
├── App.jsx              # Main app with routing
├── index.css            # Global styles & design tokens
└── main.jsx             # App entry point

public/
├── images/              # Image assets
│   ├── processed/       # Optimized photography
│   ├── blog-posts/      # Blog post images
│   └── ...              # Other images
└── Torrey_Liu_CS_Resume_Updated_2025.pdf
```

## 🎨 Design System

### Colors
- **Primary**: Slate gray scale (50-950)
- **Accent**: Warm orange scale (50-900)
- **Legacy**: Synthwave colors for compatibility

### Typography
- **Display**: Playfair Display (serif headlines)
- **Body**: Inter (sans-serif body text)
- **Mono**: IBM Plex Mono (code & technical content)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Primary, secondary, and outline variants
- **Navigation**: Transparent to solid on scroll
- **Animations**: Smooth transitions with reduced-motion support

## 📸 Photography Features

### Gallery
- **Masonry Layout**: Responsive grid with optimal image display
- **Category Filters**: Street, Automotive, Astrophotography, Concerts
- **Lightbox**: Full-screen image viewer with navigation
- **EXIF Data**: Camera settings and metadata display

### Blog
- **Photo Stories**: Curated collections with descriptions
- **Expandable Galleries**: Show more/less functionality
- **Tags & Categories**: Organized content discovery

## 💻 Project Showcase

### Case Study Format
Each project includes:
- **Challenge**: Problem statement
- **Action**: Technical approach and implementation
- **Result**: Outcomes and achievements
- **Tech Stack**: Technologies used
- **Links**: Demo and GitHub repository

### Featured Projects
- **WikiChess**: Multiplayer Wikipedia navigation game
- **GAIA**: AI-powered storytelling platform
- **Portfolio**: This very website

## 🔧 Customization

### Adding New Projects
1. Update the `spotlightData` array in `App.jsx`
2. Add project images to `public/images/`
3. Include Challenge → Action → Result details

### Adding New Photography
1. Add photos to appropriate category folders in `public/images/processed/`
2. Update metadata in `src/data/photography-data.js`
3. Images will automatically appear in the gallery

### Styling Changes
1. Modify design tokens in `tailwind.config.js`
2. Update component styles in `src/index.css`
3. Use the established design system classes

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-friendly interactions
- **Tablet**: Two-column grid, optimized spacing
- **Desktop**: Full multi-column layout with hover effects
- **Large Screens**: Maximum content width with centered layout

## ♿ Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **Focus Indicators**: Clear visual focus states
- **Alt Text**: Descriptive alt text for all images
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant color ratios
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 🚀 Performance Optimizations

- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Images load as they enter viewport
- **Code Splitting**: Route-based code splitting
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Static assets with proper cache headers

## 📈 SEO & Analytics

- **Meta Tags**: OpenGraph and Twitter Card support
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Auto-generated sitemap for search engines
- **Analytics Ready**: Prepared for Google Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: torreyliu2004@gmail.com
- **GitHub**: [@torrey1233](https://github.com/torrey1233)
- **LinkedIn**: [Torrey Liu](https://linkedin.com/in/torreyliu)
- **Instagram**: [@torreyliu](https://instagram.com/torreyliu)

---

Built with ❤️ by Torrey Liu - Creative Technologist
