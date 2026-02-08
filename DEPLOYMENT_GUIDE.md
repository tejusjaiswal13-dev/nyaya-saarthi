# 🚀 Deployment Guide

I cannot deploy directly to your account because I don't have your login credentials. However, I have configured the project so you can deploy it in **5 minutes** for free.

## Option 1: The "Split" Method (Recommended)
**Best for:** Stability and Hackathons.
- **Backend:** hosted on Render/Vercel
- **Frontend:** hosted on Netlify

### Step 1: Deploy Backend (The Engine)
1.  Push your code to **GitHub**.
2.  Go to **[Vercel.com](https://vercel.com)** and login.
3.  Click **"Add New" > "Project"**.
4.  Import your `nyaya-saarthi` repo.
5.  **Root Directory:** Click "Edit" and select `backend`.
6.  **Environment Variables:** Add `GEMINI_API_KEY` (Copy from your local .env).
7.  Click **Deploy**.
8.  **COPY THE DOMAIN** assigned to your new backend (e.g., `https://nyaya-backend.vercel.app`).

### Step 2: Deploy Frontend (The Website)
1.  Go to **[Netlify.com](https://netlify.com)** and login.
2.  Click **"Add new site" > "Import from Git"**.
3.  Select your `nyaya-saarthi` repo.
4.  **Base directory:** `frontend`
5.  **Build command:** `npm run build`
6.  **Publish directory:** `dist`
7.  **Environment Variables:**
    - Key: `VITE_API_URL`
    - Value: `https://nyaya-backend.vercel.app` (The URL you copied in Step 1, NO trailing slash).
8.  Click **Deploy Site**.

🎉 **Your website will be live!**

---

## Option 2: Run Locally for Demo
If deployment fails or takes too long, running locally is perfectly fine for a hackathon demo!

1.  **Terminal 1 (Backend):**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Terminal 2 (Frontend):**
    ```bash
    cd frontend
    npm run dev
    ```
3.  Open `http://localhost:5173` and present.
