
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a cinematic descriptive prompt for a sports match poster.
 */
export const generateMatchPosterPrompt = async (homeName: string, awayName: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a cinematic, high-energy image generation prompt for a football match poster: ${homeName} vs ${awayName}. Focus on epic stadium lighting, team spirit, and professional sports photography style. No text in the image.`,
      config: {
        systemInstruction: "You are a creative director for a top sports agency. Your job is to write detailed prompts for AI image generation. Output ONLY the prompt text."
      }
    });
    return response.text || `Epic football match poster of ${homeName} vs ${awayName}, stadium background, cinematic lighting, 8k resolution.`;
  } catch (error) {
    console.error("Error generating match poster prompt:", error);
    return `Cinematic sports poster, football match, stadium atmosphere, 8k.`;
  }
};

/**
 * Generates a poster image based on a descriptive prompt.
 */
export const generatePosterImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    console.error("Error generating poster image:", error);
    return null;
  }
};
