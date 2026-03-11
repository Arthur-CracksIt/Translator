# DeepL Proxy — Setup Guide

A tiny Express server that proxies DeepL API calls, bypassing the browser CORS restriction.

---

## Run locally (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env

# 3. Open .env and paste your DeepL API key
#    Get a free key at: https://www.deepl.com/en/pro#developer

# 4. Start the server
npm start
# → DeepL proxy running at http://localhost:3001
```

In the frontend app, set the **Backend URL** to `http://localhost:3001`.

---

## Deploy free on Railway (5 minutes)

1. Push this folder to a GitHub repo
2. Go to https://railway.app → **New Project → Deploy from GitHub**
3. Select the repo
4. Go to **Variables** → add `DEEPL_API_KEY = your_key`
5. Railway gives you a URL like `https://deepl-proxy-xxx.up.railway.app`
6. Paste that URL into the frontend app as the Backend URL

## Deploy free on Render

1. Go to https://render.com → **New Web Service**
2. Connect your GitHub repo
3. Build command: `npm install` · Start command: `npm start`
4. Add env variable: `DEEPL_API_KEY = your_key`
5. Use the Render URL in the frontend app