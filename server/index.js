import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Path to vendors.json
const dataPath = path.join(__dirname, '../src/data/vendors.json');

app.post('/api/vendors', (req, res) => {
    try {
        const newVendor = req.body;

        // Read existing file
        const fileData = fs.readFileSync(dataPath, 'utf8');
        const vendors = JSON.parse(fileData);

        // Validate ID uniqueness
        if (vendors.some(v => v.id === newVendor.id)) {
            return res.status(400).json({ error: 'Vendor ID already exists' });
        }

        // Append new vendor
        vendors.push(newVendor);

        // Write back to file
        fs.writeFileSync(dataPath, JSON.stringify(vendors, null, 2));

        console.log(`Added new vendor: ${newVendor.name}`);
        res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
    } catch (error) {
        console.error('Error writing to file:', error);
        res.status(500).json({ error: 'Failed to save vendor' });
    }
});

// GET all vendors
app.get('/api/vendors', (req, res) => {
    try {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        const vendors = JSON.parse(fileData);
        res.json(vendors);
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
});

// PUT update vendor
app.put('/api/vendors/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updatedVendor = req.body;

        const fileData = fs.readFileSync(dataPath, 'utf8');
        let vendors = JSON.parse(fileData);

        const index = vendors.findIndex(v => v.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        vendors[index] = { ...vendors[index], ...updatedVendor };

        fs.writeFileSync(dataPath, JSON.stringify(vendors, null, 2));

        console.log(`Updated vendor: ${updatedVendor.name}`);
        res.json({ message: 'Vendor updated successfully', vendor: updatedVendor });
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ error: 'Failed to update vendor' });
    }
});

// DELETE vendor
app.delete('/api/vendors/:id', (req, res) => {
    try {
        const { id } = req.params;
        console.log('DELETE request for vendor ID:', id);

        const fileData = fs.readFileSync(dataPath, 'utf8');
        let vendors = JSON.parse(fileData);

        console.log('Total vendors in file:', vendors.length);
        console.log('Vendor IDs:', vendors.map(v => v.id));

        const index = vendors.findIndex(v => v.id === id);
        console.log('Found vendor at index:', index);

        if (index === -1) {
            console.log('Vendor not found with ID:', id);
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const deletedVendor = vendors[index];
        vendors = vendors.filter(v => v.id !== id);

        fs.writeFileSync(dataPath, JSON.stringify(vendors, null, 2));

        console.log(`Deleted vendor: ${deletedVendor.name}`);
        res.json({ message: 'Vendor deleted successfully', vendor: deletedVendor });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ error: 'Failed to delete vendor' });
    }
});

// Analyze Transcript with Gemini
app.post('/api/analyze', async (req, res) => {
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

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

        res.json(data);
    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error status:', error.status);

        // Return more specific error message
        let errorMessage = error.message || 'Failed to analyze transcript.';
        if (error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again, or check your API quota in Google AI Studio.';
        }
        res.status(error.status || 500).json({ error: errorMessage });
    }
});

// Config endpoint to check if API key is configured
app.get('/api/config', (req, res) => {
    res.json({ hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
