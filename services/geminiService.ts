
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateAssetDescription = async (keywords: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve("AI functionality is disabled. Please set the API_KEY environment variable.");
  }
  
  if (!keywords.trim()) {
    return Promise.resolve("");
  }

  try {
    const prompt = `Based on the following keywords, write a concise and professional asset description suitable for an asset management system. Keywords: "${keywords}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini API:", error);
    return "Error generating description. Please try again.";
  }
};
