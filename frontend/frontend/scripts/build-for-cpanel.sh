#!/bin/bash

echo "🌐 Building Frontend for cPanel + Railway Hybrid Deployment"
echo "==========================================================="

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the frontend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production with Railway backend
echo "🏗️ Building frontend for production..."
echo "🔗 API will connect to Railway backend"
npm run build

# Verify build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Check if dist has files
if [ -z "$(ls -A dist)" ]; then
    echo "❌ Build failed: dist directory is empty"
    exit 1
fi

# Show build info
echo ""
echo "✅ Frontend build complete!"
echo ""
echo "📊 Build Statistics:"
du -sh dist/
echo "📁 Files in dist/:"
ls -la dist/
echo ""
echo "🎯 cPanel Upload Instructions:"
echo "================================"
echo "1. Compress the dist/ folder:"
echo "   cd /home/crash/Desktop/npm/frontend"
echo "   zip -r galloways-frontend.zip dist/*"
echo ""
echo "2. Upload to cPanel:"
echo "   - Login to your cPanel"
echo "   - Go to File Manager"
echo "   - Navigate to public_html/"
echo "   - Upload galloways-frontend.zip"
echo "   - Extract all files to public_html/"
echo ""
echo "3. Domain Configuration:"
echo "   - Frontend: https://galloways.co.ke (served from cPanel)"
echo "   - Backend: https://galloways-backend-production.up.railway.app"
echo ""
echo "4. Test your deployment:"
echo "   - Visit: https://galloways.co.ke"
echo "   - Check browser console for API connections"
echo "   - Verify forms submit to Railway backend"
echo ""
echo "🔧 Configuration:"
echo "Frontend: cPanel static hosting"
echo "Backend: Railway Node.js hosting"
echo "Database: Neon PostgreSQL"
echo ""
echo "✨ Your hybrid architecture is ready!"
