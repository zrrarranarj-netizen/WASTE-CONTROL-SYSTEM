import { GoogleGenAI, Type } from "@google/genai";

// Robustly handle the API key. 
// In Vite via vite.config.ts define, process.env.API_KEY will be replaced by the string value or undefined.
// We cast to string | undefined to handle TypeScript checks.
const apiKey = process.env.API_KEY as string | undefined;

// Initialize with the key if present, otherwise allow it to fail gracefully during the call
const ai = new GoogleGenAI({ apiKey: apiKey || 'missing-key' });

export interface WasteAnalysisResult {
  wasteName: string;
  category: 'Organic' | 'Inorganic' | 'Hazardous' | 'E-Waste';
  materialType: string;
  recyclingSteps: string[];
  confidence: number;
  binColor: string;
}

export const analyzeWasteImage = async (base64Image: string, mimeType: string): Promise<WasteAnalysisResult> => {
  // explicit check for easier debugging for the user
  if (!apiKey || apiKey === 'undefined' || apiKey.length < 10) {
    throw new Error("Gemini API Key is missing or invalid. Please add 'API_KEY' to your Vercel/Netlify Environment Variables.");
  }

  const prompt = `
    Analyze this image of waste material in the context of a Smart City waste management system. 
    Identify the specific item from a database of over 40,000 waste materials.
    Predict its common name.
    Classify it into one of these categories: "Organic", "Inorganic", "Hazardous", "E-Waste".
    Identify the material type (e.g., Plastic, Metal, Biological, Electronic).
    Determine the appropriate Smart City bin color (e.g., Green for Organic, Blue for Recyclable, Red for Hazardous, Black for General/Landfill).
    Provide a step-by-step procedure on how to recycle or dispose of it properly.
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wasteName: { type: Type.STRING, description: "The predicted name of the waste item" },
            category: { type: Type.STRING, enum: ["Organic", "Inorganic", "Hazardous", "E-Waste"], description: "Primary classification" },
            materialType: { type: Type.STRING, description: "The specific material (e.g., HDPE Plastic, Aluminum)" },
            binColor: { type: Type.STRING, description: "Recommended bin color for disposal" },
            recyclingSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step by step recycling or disposal instructions"
            },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
          },
          required: ["wasteName", "category", "materialType", "binColor", "recyclingSteps", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI service.");
    }

    // Clean markdown code blocks if present (e.g. ```json ... ```)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanedText) as WasteAnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON:", cleanedText);
      throw new Error("AI response was not valid JSON. Please try again.");
    }

  } catch (error: any) {
    console.error("Error analyzing waste:", error);
    // Provide user-friendly error messages
    if (error.message?.includes('API_KEY')) {
       throw error;
    }
    if (error.status === 403) {
      throw new Error("API Key invalid or quota exceeded. Please check your Google Cloud Console.");
    }
    throw new Error(error.message || "Failed to analyze image. Please try again.");
  }
};