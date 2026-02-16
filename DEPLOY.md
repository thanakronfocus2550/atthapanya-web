# Deployment Guide for Attapanya Institute Site

This guide will walk you through deploying your Next.js application. The easiest and recommended way is to use **Vercel**, the creators of Next.js.

## Option 1: Vercel (Recommended)

Vercel provides the best performance and integration for Next.js apps with zero configuration.

### 1. Push Your Code to GitHub
If you haven't already, push your code to a GitHub repository.

1.  Create a new repository on [GitHub](https://github.com/new).
2.  Run the following commands in your terminal (if needed):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

### 2. Connect to Vercel
1.  Go to [Vercel.com](https://vercel.com/signup) and sign up/login with GitHub.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository `my-institute-site`.
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: leave as `./`.
    *   **Build Command**: `next build` (default).
    *   **Output Directory**: `.next` (default).
    *   **Environment Variables**: If you have any (e.g., database URLs), add them here.
5.  Click **Deploy**.

Vercel will build your app and give you a live URL (e.g., `my-institute-site.vercel.app`).

---

## Option 2: Netlify

Netlify is another excellent option for hosting Next.js sites.

1.  Go to [Netlify.com](https://www.netlify.com/) and sign up/login.
2.  Click **"Add new site"** -> **"Import an existing project"**.
3.  Connect to GitHub and select your repository.
4.  **Build Settings**:
    *   **Base directory**: (leave empty).
    *   **Build command**: `npm run build`.
    *   **Publish directory**: `.next`.
5.  Click **Deploy site**.

---

## Option 3: Manual / VPS (Advanced)

If you have your own server (DigitalOcean, AWS, etc.):

1.  Install Node.js on your server.
2.  Clone your repository.
3.  Run `npm install`.
4.  Build the app: `npm run build`.
5.  Start the server: `npm start`.
    *   Ideally, use a process manager like **PM2** to keep it running: `pm2 start npm --name "next-app" -- start`.
