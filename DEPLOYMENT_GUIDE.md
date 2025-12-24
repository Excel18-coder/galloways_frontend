# Deployment Guide

## Frontend Deployment (Vercel)

### Prerequisites

- GitHub repository connected to Vercel
- Node.js 20.11.0

### Environment Variables in Vercel

Set these in your Vercel project settings:

```bash
VITE_API_URL=https://your-backend-url.onrender.com
VITE_NODE_ENV=production
```

### Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Install Command**: `npm install --legacy-peer-deps`
- **Output Directory**: `dist`
- **Node Version**: 20.11.0 (automatically detected from .node-version)

### Deploy

1. Push changes to GitHub
2. Vercel will automatically deploy
3. Or manually trigger deployment in Vercel dashboard

---

## Backend Deployment (Render)

### Prerequisites

- GitHub repository connected to Render
- PostgreSQL database (can create on Render)
- Cloudinary account for file uploads

### Environment Variables in Render

Set these in your Render service settings:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-strong-jwt-secret
JWT_REFRESH_SECRET=your-strong-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Render Service Settings

- **Environment**: Docker
- **Dockerfile Path**: `./Dockerfile`
- **Health Check Path**: `/`
- **Region**: Oregon (or your preferred region)
- **Plan**: Free (or paid plans for production)

### Database Setup

1. Create a PostgreSQL database in Render
2. Copy the Internal Database URL
3. Add it as `DATABASE_URL` environment variable
4. Migrations will run automatically on build

### Deploy

1. Push changes to GitHub
2. Render will automatically build and deploy
3. Or manually trigger deployment in Render dashboard

---

## Post-Deployment Checklist

### Frontend

- ✅ Environment variables set in Vercel
- ✅ Build succeeds without errors
- ✅ CORS configured correctly in backend
- ✅ API URL points to backend

### Backend

- ✅ All environment variables set in Render
- ✅ Database connected successfully
- ✅ Migrations run successfully
- ✅ Health check returns 200
- ✅ CORS allows frontend URL
- ✅ JWT secrets are strong and unique

---

## Troubleshooting

### Frontend Issues

**Build Fails with Dependency Errors:**

- Solution: Using npm with `--legacy-peer-deps` instead of pnpm
- Check `.npmrc` configuration

**404 on Refresh:**

- Solution: Already configured in `vercel.json` rewrites
- All routes redirect to `index.html`

### Backend Issues

**Database Connection Failed:**

- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure IP allowlist includes Render IPs

**CORS Errors:**

- Update `FRONTEND_URL` environment variable
- Restart service after changing env vars

**Build Timeout:**

- Docker build optimized with multi-stage build
- Dependencies cached efficiently

---

## Monitoring

### Frontend (Vercel)

- Check deployment logs in Vercel dashboard
- Monitor analytics and performance

### Backend (Render)

- Check logs in Render dashboard
- Monitor service health
- Set up log drains for long-term storage

---

## Scaling

### Frontend

- Vercel automatically scales
- Edge network distribution included
- No configuration needed

### Backend

- Upgrade Render plan for more resources
- Consider adding Redis for caching
- Use Render's autoscaling features
