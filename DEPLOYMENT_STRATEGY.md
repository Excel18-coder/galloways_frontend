# Vercel Deployment Guide

## Current Issue
The repository contains both frontend and backend (API) code, which is causing Vercel deployment confusion.

## Solution Implemented
Configure Vercel to deploy **only the frontend** as a static site.

## Configuration

### 1. vercel.json
```json
{
  "version": 2,
  "name": "galloways-finale-frontend",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 2. .vercelignore
- Excludes entire `api/` directory
- Excludes root-level configs
- Only deploys frontend code

## Alternative Solutions

### Option A: Separate Repositories (Recommended for Production)
1. Create separate repo for frontend: `galloways-frontend`
2. Create separate repo for backend: `galloways-api`
3. Deploy frontend to Vercel
4. Deploy API to Railway, Render, or similar

### Option B: Monorepo with Proper Configuration (Current Approach)
- Keep both in same repo
- Use `.vercelignore` to exclude API
- Configure Vercel to build only frontend
- Deploy API separately to another service

### Option C: Vercel Functions (For Simple APIs)
- Move API endpoints to Vercel Functions
- Keep everything in one deployment
- Limited to serverless functions

## Deployment Process
1. Push changes to GitHub
2. Vercel detects `frontend/package.json`
3. Runs `pnpm run vercel-build` in frontend directory
4. Builds to `frontend/dist`
5. Deploys static files

## API Deployment
Since Vercel is for frontend only, deploy API to:
- **Railway**: Best for Node.js/NestJS APIs
- **Render**: Good free tier for APIs
- **Heroku**: Traditional option
- **AWS/Azure**: Cloud platforms

## Environment Variables
Set in Vercel dashboard:
- `VITE_API_URL`: Your deployed API URL
- Other frontend environment variables