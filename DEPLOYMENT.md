# Vercel Deployment Guide for Galloways Insurance

## 🚀 Deployment Instructions

### Prerequisites
- GitHub repository pushed with latest changes ✅
- Vercel account connected to GitHub
- Environment variables configured

### Environment Variables Required

#### Backend (API) Environment Variables
Add these to your Vercel project settings:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
DB_HOST=your_database_host
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=galloways_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d

# M-Pesa Configuration (if using M-Pesa payments)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_business_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://your-domain.vercel.app/api/v1/payments/mpesa/callback
MPESA_TIMEOUT_URL=https://your-domain.vercel.app/api/v1/payments/mpesa/timeout

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application Configuration
NODE_ENV=production
PORT=8000
```

#### Frontend Environment Variables
Add these for frontend configuration:

```bash
# API Configuration
VITE_API_URL=https://your-api-domain.vercel.app/api/v1
VITE_APP_URL=https://your-domain.vercel.app

# Payment Configuration
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### Deployment Steps

1. **Connect Repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `Galloways_Finale`

2. **Configure Build Settings**
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `cd frontend && pnpm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && pnpm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables listed above
   - Make sure to set them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Post-Deployment Configuration

1. **Database Setup**
   - Ensure your PostgreSQL database is accessible from Vercel
   - Run database migrations if needed
   - Verify database connection

2. **File Uploads**
   - Configure Cloudinary or alternative file storage
   - Update file upload endpoints if needed

3. **Admin Access**
   - Admin login: `williamanalo62@gmail.com`
   - Password: `Galloways@2025`
   - Access admin at: `https://your-domain.vercel.app/admin`

### Features Available After Deployment

✅ **Admin Authentication System**
- Secure admin login with session management
- Protected admin routes

✅ **Resource Management**
- File upload, download, and management
- File categorization and search

✅ **Payment Integration**
- M-Pesa STK Push payments
- Payment tracking and management

✅ **Complete Insurance Platform**
- Claims management
- Quote generation
- Consultation booking
- Diaspora services
- User management

### Monitoring & Maintenance

- Monitor deployment logs in Vercel dashboard
- Check function execution logs for API endpoints
- Monitor database performance and connections
- Regular backups of uploaded files and database

### Support

If you encounter any issues during deployment:
1. Check Vercel build logs
2. Verify environment variables are set correctly
3. Ensure database connectivity
4. Check domain DNS settings

---

**Deployment Status: Ready for Production** 🚀

All code has been committed and pushed to GitHub with comprehensive features including admin authentication, resource management, payment integration, and bug fixes.