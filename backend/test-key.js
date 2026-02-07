require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    const key = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    const genAI = new GoogleGenerativeAI(key);

    try {
        // Not all keys can list models, but let's try assuming standard key
        // Note: listModels might not be available on the client directly in older versions, 
        // but with @latest it might be under a manager. 
        // Actually, let's just try 'gemini-1.5-flash' again but strict.

        // Let's print the error more clearly if it fails.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Attempting generation with gemini-pro...");
        const result = await model.generateContent("Hi");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.log("----------------PENDING ERROR----------------");
        console.log(error.message);
        console.log(JSON.stringify(error, null, 2));
    }
}

test();
