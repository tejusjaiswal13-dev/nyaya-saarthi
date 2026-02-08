# 🚀 Ultimate "One Place" Deployment (Vercel)

Deploy your entire app (Frontend + Backend) to a single URL.

## Step 1: Push Changes
I have updated the code to work as a single unit. Run these commands in your terminal:
```bash
git add .
git commit -m "Configure for single Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel
1.  Go to **[Vercel.com](https://vercel.com)**.
2.  **Add New > Project** > Import `nyaya-saarthi`.
3.  **Framework Preset:** Select **Vite**.
4.  **Root Directory:** Vercel might ask. Leave it as `/` (Root).
    - If it forces a choice, select `frontend` but then we need to tweak settings.
    - **BETTER:** Go to Settings -> "Build & Development Settings":
        - **Build Command:** `cd frontend && npm install && npm run build`
        - **Output Directory:** `frontend/dist`
        - **Install Command:** `cd frontend && npm install`
5.  **Environment Variables:**
    - `GEMINI_API_KEY`: Paste your key.
6.  Click **Deploy**.

## How it works now
- Your website will be at `https://nyaya-saarthi.vercel.app`
- Your API will be at `https://nyaya-saarthi.vercel.app/api/chat`
- The frontend automatically talks to the backend on the same URL!
