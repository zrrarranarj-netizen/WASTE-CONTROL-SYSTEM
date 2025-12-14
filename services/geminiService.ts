import { GoogleGenAI, Type } from "@google/genai";

// Create the client instance using the environment variable directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface WasteAnalysisResult {
  wasteName: string;
  category: 'Organic' | 'Inorganic';
  materialType: string;
  recyclingSteps: string[];
  confidence: number;
}

export const analyzeWasteImage = async (base64Image: string, mimeType: string): Promise<WasteAnalysisResult> => {
  // API key validation is handled by the environment assumption as per guidelines

  const prompt = `
    Analyze this image of waste material. 
    Identify the specific item from a database of over 40,000 waste materials.
    Predict its common name.
    Classify it strictly as "Organic" or "Inorganic".
    Identify the material type (e.g., Plastic, Metal, Biological).
    Provide a step-by-step procedure on how to recycle or dispose of it properly in a smart city context.
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
            category: { type: Type.STRING, enum: ["Organic", "Inorganic"], description: "Primary classification" },
            materialType: { type: Type.STRING, description: "The specific material (e.g., HDPE Plastic, Aluminum)" },
            recyclingSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Step by step recycling or disposal instructions"
            },
            confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" }
          },
          required: ["wasteName", "category", "materialType", "recyclingSteps", "confidence"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as WasteAnalysisResult;

  } catch (error) {
    console.error("Error analyzing waste:", error);
    throw error;
  }
};