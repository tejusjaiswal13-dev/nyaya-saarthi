# Nyaya Saarthi ⚖️

**Nyaya Saarthi** is an AI-powered legal assistance platform designed for Indian citizens. It helps users assess the urgency of their legal situations and provides guidance based on Indian Law in simple language.

## 🚀 Features

- **AI Legal Assistant**: A unified interface that listens to your legal problems and instantly provides:
    - **Urgency Level**: (Critical/High/Medium/Low) based on Indian legal frameworks.
    - **Legal Insight**: Simplified explanation of relevant laws (IPC, CrPC, etc.).
    - **Action Plan**: Immediate recommended steps.
- **Hybrid Intelligence**: Uses Google Gemini AI when available, with a smart heuristic fallback system for offline reliability.
- **Privacy First**: Secure processing of user queries.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, Google Genesrative AI
- **Architecture**: Monorepo-style structure

## 📦 Installation

### Prerequisites
- Node.js installed

### Setup

1.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file
    cp .env.example .env
    # Add your GEMINI_API_KEY in .env (Optional but recommended)
    ```
    Start the server:
    ```bash
    npm run dev
    ```

2.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## 📝 Usage

1. Open `http://localhost:5173`
2. Click **Start Legal Assessment**
3. Type your situation (e.g., "My landlord is evicting me").
4. Receive instant analysis with urgency indicators and legal advice.

---
*Disclaimer: Nyaya Saarthi is a tool for information and guidance. It is not a substitute for professional legal advice.*
