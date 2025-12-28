import { GoogleGenerativeAI } from "@google/generative-ai";
import { LetterStatus } from "../../types/letter.types";
import dotenv from "dotenv";
dotenv.config();

export const analyzeLetterContent = async (
  content: string
): Promise<LetterStatus> => {
  console.log("--- AI Analysis Start ---");
  console.log("Content:", content);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY is missing in backend/.env!");
    return "Sorting";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
            You are Santa Clauses's Head Elf in charge of the Naughty or Nice list.
            Analyze the following letter from a child and determine if they have been "Nice" or "Naughty" this year.
            
            Guidelines:
            - "Nice": Polite, sharing, helpful, kind, or expressing genuine wishes.
            - "Naughty": Rude, demanding, selfish, or showing bad behavior.
            
            Response MUST be exactly one word: either "Nice" or "Naughty".
            
            Letter Content:
            "${content}"
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    const verdict = text.match(/\b(Nice|Naughty)\b/i)?.[0];

    if (verdict === "Nice") return "Nice";
    if (verdict === "Naughty") return "Naughty";

    return "Sorting";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Sorting";
  } finally {
    console.log("--- AI Analysis End ---");
  }
};
