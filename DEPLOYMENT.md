# 🚀 Portfolio Deployment Guide

## The Problem
Your blog posts are fetched from a local API server (`http://localhost:3001`) which doesn't exist in production, causing blog posts to not appear on your deployed website.

## The Solution
We've implemented a hybrid approach that:
1. **Development**: Uses API server for dynamic blog posts
2. **Production**: Uses static blog posts exported from the database

## 🛠️ How to Deploy

### Option 1: Quick Production Build (Recommended)
```bash
npm run build:prod
```
This will:
- Export blog posts from your database
- Build the application
- Create a production-ready `dist` folder

### Option 2: Manual Steps
```bash
# 1. Export blog posts from database
npm run export:blogs

# 2. Build the application
npm run build

# 3. Deploy the dist folder
```

## 📁 What Gets Built

The `dist` folder contains:
- ✅ Static blog posts (exported from database)
- ✅ All your photos and thumbnails
- ✅ Optimized JavaScript and CSS
- ✅ No API dependencies

## 🔄 Workflow for Updates

### When you add new blog posts:

1. **In Development**:
   ```bash
   npm run dev:full  # Start both API and frontend
   ```
   - Use the admin panel to create blog posts
   - Blog posts are stored in the database

2. **Before Deployment**:
   ```bash
   npm run build:prod  # Export and build
   ```
   - Blog posts are exported to static files
   - Build includes all blog posts

3. **Deploy**:
   - Copy the `dist` folder to your server
   - Blog posts are now included in the build

## 🐛 Troubleshooting

### Blog posts not showing in production?
1. Check if `src/data/static-blog-posts.js` exists
2. Run `npm run export:blogs` to regenerate it
3. Rebuild with `npm run build:prod`

### API server not running in development?
```bash
npm run dev:full  # Starts both API and frontend
```

### Database connection issues?
- Make sure your `.env` file has the correct `DATABASE_URL`
- Run `npm run db:generate` to ensure Prisma client is up to date

## 📊 File Structure

```
src/
├── data/
│   ├── photography-data.js      # Original static blog posts
│   └── static-blog-posts.js     # Auto-generated from database
├── components/
│   └── Photography.jsx          # Updated to use both sources
dist/                            # Production build output
├── index.html
├── assets/
└── images/
```

## 🎯 Key Changes Made

1. **Photography.jsx**: Now detects development vs production mode
2. **Export Script**: Exports database blog posts to static files
3. **Build Script**: Automated production build process
4. **Fallback System**: Gracefully handles missing API or database

Your blog posts will now work in production! 🎉
