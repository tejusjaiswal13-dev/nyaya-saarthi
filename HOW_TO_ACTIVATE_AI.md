# 🔑 How to Activate the AI (Get Your Free API Key)

To make Nyaya Saarthi "fully working" with real AI analysis, you need a Google Gemini API Key. Use the following instructions to obtain a key.

## Step 1: Get the Key
1.  Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
2.  Click **Create API Key**.
3.  Copy the key string (starts with `AIza...`).

## Step 2: Add it to the Project
1.  Open the file `backend/.env`.
2.  Paste your key like this:
    ```env
    PORT=5000
    GEMINI_API_KEY=AIzaSyDxxxxxxxxx...
    ```
3.  **Save the file.**

## Step 3: Restart Backend
1.  Go to your backend terminal.
2.  Press `Ctrl + C` to stop the server.
3.  Run `npm run dev` again.

## Why is this needed?
The AI system (Google Gemini) runs in the cloud. The API Key is your "password" to access it. Without it, the app runs in **Offline Keyword Mode** (Heuristic fallback).
