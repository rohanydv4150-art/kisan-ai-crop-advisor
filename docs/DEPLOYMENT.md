# Production Deployment Guide

## Architecture Overview
- **Frontend**: Single Page Application (React + Vite + Tailwind CSS) deployed on **Vercel** or **Netlify**.
- **Backend**: Express API service deployed on **Render**, **Railway**, or **AWS ECS**.
- **Database & Auth**: Managed PostgreSQL and Authentication on **Supabase**.
- **AI Engine**: Google Gemini API via official `@google/genai` SDK.

---

## 1. Backend Deployment (Render / Railway)

### Setting up on Render:
1. Create a new **Web Service** on Render and connect your repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/v1/health`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-supabase-service-role-key`
   - `GEMINI_API_KEY`: `your-google-gemini-api-key`
   - `GEMINI_MODEL`: `gemini-2.5-flash`

---

## 2. Frontend Deployment (Vercel)

### Setting up on Vercel:
1. In Vercel, click **Add New Project** and select your repository.
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
4. Add Rewrites in `client/vercel.json` if proxying API routes:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-api.onrender.com/api/$1"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## 3. Production Health Verification

Verify deployment health:
```bash
curl https://your-backend-api.onrender.com/api/v1/health
```

Expected output:
```json
{
  "success": true,
  "message": "Agricultural Crop Advisory System is healthy",
  "data": {
    "status": "UP"
  }
}
```
