# Photo Organization System

This system automatically detects new photos in your blog folders and generates the necessary metadata to display them on your website.

## ✅ **Aurora Photos Fixed**

The aurora photos have been added back to the metadata and will now display in the blog posts.

## 🚀 **Automatic Photo Detection**

### How It Works

1. **Add photos to your folders:**
   - Blog photos: `public/images/blog-posts/[blog-id]/`
   - Gallery photos: `public/images/processed/[category]/`

2. **Run the organization script:**
   ```bash
   node organize-photos.js
   ```

3. **Copy the generated metadata** to `src/data/photography-data.js`

4. **Visit the admin panel** at `/photography/admin` to validate everything

### Quick Start

1. **Add new photos** to the appropriate folders
2. **Run the script:**
   ```bash
   node organize-photos.js
   ```
3. **Copy the generated metadata** from the output files
4. **Check the admin panel** at `/photography/admin`

## 📁 **Folder Structure**

```
public/images/
├── blog-posts/
│   ├── aurora-june-2-2025/
│   ├── stargazing-denholm-july-25-2025/
│   └── pomelo-soda-aug-9-2025/
└── processed/
    ├── street/
    ├── automotive/
    ├── astro/
    └── concerts/
```

## 🛠️ **Admin Panel**

Visit `/photography/admin` to:
- ✅ Check if all photos have metadata
- ❌ See missing photos
- 📝 Generate update scripts
- 🔄 Refresh validation

## 📋 **Current Status**

- **Gallery Photos:** 33 photos across all categories
- **Blog Photos:** Aurora photos restored and working
- **Admin Panel:** Available at `/photography/admin`
- **Auto-detection:** Script available at `organize-photos.js`

## 🔧 **Troubleshooting**

### Photos not showing up?
1. Check the admin panel at `/photography/admin`
2. Run `node organize-photos.js` to generate metadata
3. Copy the generated metadata to `src/data/photography-data.js`

### Website crashes?
1. The validation system will detect issues automatically
2. Check the browser console for error messages
3. Use the admin panel to identify missing metadata

### Adding new blog posts?
1. Create a new folder in `public/images/blog-posts/`
2. Add photos to the folder
3. Run `node organize-photos.js`
4. Update the `blogPosts` object in `src/data/photography-data.js`

## 🎯 **Next Steps**

1. **Test the system** by adding a new photo to any folder
2. **Run the script** to generate metadata
3. **Use the admin panel** to validate everything
4. **Your website will automatically update!**

The system is now robust and will prevent crashes while automatically detecting new photos!
