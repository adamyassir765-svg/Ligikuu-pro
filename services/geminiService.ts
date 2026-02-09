
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a cinematic descriptive prompt for a sports match poster.
 */
export const generateMatchPosterPrompt = async (homeName: string, awayName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    if (!process.env.API_KEY) throw new Error("API_KEY missing");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a cinematic, detailed AI image prompt for a sports match poster: ${homeName} vs ${awayName}. Description: Epic stadium lighting, smoke, professional team branding, dramatic atmosphere, high definition. No text in the background.`,
      config: {
        systemInstruction: "You are a professional creative prompt engineer. Output only the prompt text for image generation."
      }
    });
    return response.text || `Epic sports match poster, ${homeName} vs ${awayName}, stadium lighting, 8k.`;
  } catch (error) {
    console.error("AI Text Error:", error);
    return `Cinematic sports match poster for ${homeName} vs ${awayName}, dramatic lighting, 8k.`;
  }
};

/**
 * Generates a poster image based on a descriptive prompt.
 */
export const generatePosterImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    if (!process.env.API_KEY) throw new Error("API_KEY missing");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("AI Image Error:", error);
    return null;
  }
};
