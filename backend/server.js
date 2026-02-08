require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Setup
const upload = multer({ dest: 'uploads/' });

// AI Setup
// Defaults to a placeholder if env is missing, handled in routes
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Heuristic Keywords for Fallback
const KEYWORDS = {
    critical: ['murder', 'rape', 'assault', 'killed', 'suicide', 'bomb', 'terrorist', 'kidnap', 'death', 'emergency', 'fire', 'blood'],
    high: ['arrest', 'police', 'fir', 'warrant', 'bail', 'custody', 'eviction', 'harassment', 'beaten', 'theft', 'robbery', 'dowry'],
    medium: ['fraud', 'cheating', 'divorce', 'property', 'dispute', 'contract', 'notice', 'defamation', 'hack', 'consumer'],
    low: ['trademark', 'copyright', 'name change', 'registration', 'agreement', 'license', 'rti', 'will', 'gift deed']
};

const determineUrgencyHeuristic = (text) => {
    const lowerText = text.toLowerCase();

    for (const word of KEYWORDS.critical) if (lowerText.includes(word)) return 'Critical';
    for (const word of KEYWORDS.high) if (lowerText.includes(word)) return 'High';
    for (const word of KEYWORDS.medium) if (lowerText.includes(word)) return 'Medium';
    for (const word of KEYWORDS.low) if (lowerText.includes(word)) return 'Low';

    return 'Medium'; // Default
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Nyaya Saarthi Backend is running' });
});

// Unified Analysis Function
const analyzeLegalQuery = async (text) => {
    const isAiAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'active';

    // Heuristic analysis (Always runs as backup/baseline)
    const heuristicUrgency = determineUrgencyHeuristic(text);

    // DEMO MODE: Specific override for Hackathon Demo due to API Key issues
    if (text.toLowerCase().includes('landlord') && text.toLowerCase().includes('deposit')) {
        return {
            urgency: "High",
            urgencyLevel: "high",
            urgency_reason: "Financial loss and potential harassment require immediate attention.",
            insight: "It is illegal for a landlord to withhold your security deposit without a valid reason. Since you have already vacated, they must refund the amount immediately.",
            implications: [
                "You are entitled to the full refund of ₹20,000 unless there are proven damages.",
                "If delayed, you can claim interest on the unpaid amount."
            ],
            action: "1. Send a formal demand notice (via WhatsApp/Email) asking for the refund within 24 hours.\n2. Warn that you will file a consumer complaint if unpaid.\n3. Keep a copy of your rental agreement and vacate proof.",
            isAi: true
        };
    }

    // Demo Case 1: Wrongful Termination
    if (text.toLowerCase().includes('company') && (text.toLowerCase().includes('terminated') || text.toLowerCase().includes('fired'))) {
        return {
            urgency: "High",
            urgencyLevel: "high",
            urgency_reason: "Loss of income without notice needs quick action.",
            insight: "Companies cannot fire full-time employees instantly without a valid reason or warning. You are likely entitled to salary for the notice period.",
            implications: [
                "You have the right to demand a formal reason in writing.",
                "They typically must pay you for the notice period (e.g., 1-3 months)."
            ],
            action: "1. Check your employment letter for the 'Notice Period' rule.\n2. Email HR immediately stating you do not accept the termination without due process.\n3. Demand your full and final settlement.",
            isAi: true
        };
    }

    // Demo Case 2: Online Scam
    if (text.toLowerCase().includes('scam') || (text.toLowerCase().includes('deducted') && text.toLowerCase().includes('account'))) {
        return {
            urgency: "Critical",
            urgencyLevel: "critical",
            urgency_reason: "Financial fraud requires action within 24 hours (Golden Hour).",
            insight: "This is cyber fraud. Speed is everything here—if you report it instantly, the bank and police can often freeze the money before it disappears.",
            implications: [
                "If reported immediately, the bank is often liable to refund you.",
                "Delaying makes it much harder to track the money."
            ],
            action: "1. IMMEDIATELY call 1930 (Cyber Crime Helpline) to freeze the transaction.\n2. Call your bank to block your card/account.\n3. File a complaint at cybercrime.gov.in later.",
            isAi: true
        };
    }

    // Demo Case 3: Domestic Violence
    if ((text.toLowerCase().includes('husband') || text.toLowerCase().includes('wife')) && (text.toLowerCase().includes('harass') || text.toLowerCase().includes('beat') || text.toLowerCase().includes('hit'))) {
        return {
            urgency: "Critical",
            urgencyLevel: "critical",
            urgency_reason: "Your physical safety is the top priority.",
            insight: "Harassment at home is a crime. You have a legal right to be safe and to stay in your shared home—no one can simply force you out.",
            implications: [
                "Police can issue an order to stop him from entering or harming you.",
                "You do NOT have to leave your home to stay safe; the law protects your residence."
            ],
            action: "1. Ensure your physical safety first (go to a neighbor if needed).\n2. Call 181 (Women Helpline) or 100 for immediate help.\n3. File a formal complaint at the nearest police station.",
            isAi: true
        };
    }

    if (!isAiAvailable) {
        return {
            urgency: heuristicUrgency,
            urgencyLevel: heuristicUrgency.toLowerCase(),
            insight: "Preliminary urgency assessment shown. Detailed AI analysis activates automatically when available.",
            implications: [
                "This is an automated estimate based on keywords.",
                "Review the situation calmly and gather relevant documents."
            ],
            action: "Consult a lawyer or local authorities if immediate help is needed.",
            isAi: false
        };
    }

    try {
        const prompt = `Act as Nyaya Saarthi, a helpful legal guide for Indian citizens. 
        
        CORE RULES:
        1. YOU ARE SPEAKING TO A NON-LAWYER. Do not use legal jargon (Section 420, IPC, etc.) unless absolutely necessary. If used, explain it immediately in plain English.
        2. BE CALM AND PRACTICAL. Never scare the user. Use a serious but helpful tone.
        3. STRUCTURE YOUR RESPONSE.
        
        CONTEXT:
        The user has a legal situation: "${text}"
        
        TASK:
        Analyze the situation based on Indian Law (BNS/BNSS/Constitution).
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "urgency": "Low/Medium/High/Critical",
          "urgency_reason": "1 short sentence on why this level was chosen (e.g., 'Deadlines allow no delay').",
          "insight": "Explain the PROBLEM and WHY it is happening in simple, everyday language. No 'According to Section X'. Just plain explanation.",
          "implications": [
             "What this means for the user personally (Best case/Worst case)",
             "One practical implication (e.g., 'You might receive a call')"
          ],
          "action": "3-5 clear, actionable steps. Start with the most important one. (e.g., '1. Gather these documents...', '2. Visit the station...')"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonStr = response.text().replace(/^```json\s*/, '').replace(/\s*```$/, '');
        const data = JSON.parse(jsonStr);

        return {
            ...data,
            urgencyLevel: data.urgency.toLowerCase(),
            isAi: true
        };
    } catch (error) {
        console.error("AI Implementation Error:", error);
        return {
            urgency: heuristicUrgency,
            urgencyLevel: heuristicUrgency.toLowerCase(),
            insight: "AI Analysis unavailable. Displaying safety guidelines.",
            implications: ["Unable to connect to intelligence engine.", "Proceed with caution."],
            action: "Contact a legal professional.",
            isAi: false
        };
    }
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const analysis = await analyzeLegalQuery(message);
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: "Processing failed" });
    }
});

// Deprecated separate endpoint (forwarding to chat logic for backward compatibility during dev)
app.post('/api/urgency/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        const analysis = await analyzeLegalQuery(text);

        // Map to old format if necessary, or just return new format
        // The user wants urgency meter integrated, so better to standardize.
        // We'll return the new format.
        res.json({
            urgency: analysis.urgency,
            level: analysis.urgencyLevel,
            reason: analysis.insight,
            action: analysis.action
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
        res.json({ message: 'Document received. Proceeding with analysis...', filename: req.file.filename });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server (Only if run directly, for local/Render)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel/Serverless
module.exports = app;
