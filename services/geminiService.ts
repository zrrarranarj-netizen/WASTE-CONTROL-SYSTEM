import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client using process.env.API_KEY.
// The key is assumed to be provided by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface WasteAnalysisResult {
  wasteName: string;
  category: 'Organic' | 'Inorganic' | 'Hazardous' | 'E-Waste';
  materialType: string;
  recyclingSteps: string[];
  confidence: number;
  binColor: string;
}

export const analyzeWasteImage = async (base64Image: string, mimeType: string): Promise<WasteAnalysisResult> => {
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
      model: 'gemini-3-flash-preview',
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

    try {
      return JSON.parse(text) as WasteAnalysisResult;
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("AI response was not valid JSON. Please try again.");
    }

  } catch (error: any) {
    console.error("Error analyzing waste:", error);
    throw new Error(error.message || "Failed to analyze image. Please try again.");
  }
};