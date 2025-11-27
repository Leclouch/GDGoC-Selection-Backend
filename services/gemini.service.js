// services/gemini.service.js
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

// use stable model name
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateMenuAI = async (category) => {
  const prompt = `
    Generate a JSON object ONLY. No explanation, no markdown.

    {
      "name": "string",
      "category": "${category}",
      "calories": number 100-800,
      "price": number 5000-50000,
      "ingredients": ["ingredient1", "ingredient2"],
      "description": "short description"
    }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // extract JSON safely
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI returned invalid JSON");

  // clean trailing commas or weird tokens
  const cleaned = match[0]
    .replace(/,\s*}/g, "}")     // remove trailing commas
    .replace(/,\s*]/g, "]");    // remove trailing commas

  return JSON.parse(cleaned);
};
