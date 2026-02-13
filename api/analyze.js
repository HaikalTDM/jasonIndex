import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { transcript, apiKey } = req.body;
        const finalApiKey = apiKey || process.env.GEMINI_API_KEY;

        if (!transcript) {
            return res.status(400).json({ error: 'Missing transcript' });
        }

        if (!finalApiKey) {
            return res.status(400).json({ error: 'API key not provided and not configured on server' });
        }

        const genAI = new GoogleGenerativeAI(finalApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are an expert food review analyst. Extract the following details from the video transcript provided below.
        
        Return ONLY a raw JSON object (no markdown, no code blocks) with this structure:
        {
            "score": number, // Extracted score (0.0 to 10.0). Look for "I give this a 8.5", "Score: 7", etc. If unsure/not found, return 0.
            "keypoints": ["string", "string", "string"], // 3 short, punchy highlights (max 10 words each). Focus on taste, texture, price, or unique features.
            "review_date": "YYYY-MM-DD" // Estimated date if mentioned (e.g., "Visited on Christmas 2024"), otherwise use today's date "${new Date().toISOString().split('T')[0]}".
        }

        Transcript:
        ${transcript}
        `;

        // Retry logic for rate limits
        let retries = 3;
        let result;

        for (let i = 0; i < retries; i++) {
            try {
                result = await model.generateContent(prompt);
                break; // Success, exit loop
            } catch (err) {
                if (err.status === 429 && i < retries - 1) {
                    const waitTime = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
                    console.log(`Rate limit hit, retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else {
                    throw err; // Re-throw if not rate limit or last retry
                }
            }
        }

        const response = await result.response;
        const text = response.text();

        // Clean markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Gemini Analysis Error:', error);

        // Return more specific error message
        let errorMessage = error.message || 'Failed to analyze transcript.';
        if (error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again, or check your API quota in Google AI Studio.';
        }
        return res.status(error.status || 500).json({ error: errorMessage });
    }
}
