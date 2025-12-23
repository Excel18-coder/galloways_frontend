# Frontend-Backend Connection Configuration

## Current Configuration

### Development (.env)

- **API URL**: `http://localhost:8000/api/v1`
- Used for local development

### Production (.env.production)

- **API URL**: Update this with your Render backend URL
- Format: `https://your-backend-name.onrender.com/api/v1`

## Steps to Connect Frontend to Backend:

1. **Deploy Backend to Render**

   - Repository: `https://github.com/Excel18-coder/galloways_frontend.git`
   - Root Directory: `backend`
   - Build Command: `cd backend && npm install --legacy-peer-deps && npm run build`
   - Start Command: `cd backend && node dist/main.js`

2. **Get Your Render Backend URL**

   - After deployment, Render will give you a URL like: `https://galloways-backend-xyz.onrender.com`

3. **Update Frontend Environment Variables**

   **For Vercel (Production):**

   - Go to your Vercel project settings
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-render-backend-url.onrender.com/api/v1`

   **For Local Development:**

   - The `.env` file already points to `http://localhost:8000/api/v1`
   - Start your backend locally with `npm run start:dev` in the backend folder

4. **Redeploy Frontend on Vercel**
   - Push changes to GitHub
   - Vercel will automatically redeploy with the new environment variable

## Current API Configuration Location

The API base URL is configured in:

- `src/lib/api.ts` - Line 1-2
- Fallback: `https://gallo-api.onrender.com/api/v1`

## CORS Configuration

Make sure your backend `.env` has:

```
CORS_ORIGIN=https://galloways.co.ke
```

Or for multiple origins:

```
CORS_ORIGIN=https://galloways.co.ke,https://www.galloways.co.ke
```
