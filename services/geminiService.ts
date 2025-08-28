
import { GoogleGenAI } from "@google/genai";
import { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askWithPdf = async (prompt: string, file: UploadedFile): Promise<string> => {
    try {
        const filePart = {
            inlineData: {
                mimeType: file.mimeType,
                data: file.data,
            },
        };

        const textPart = {
            text: prompt,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [filePart, textPart] },
            config: {
                systemInstruction: `You are a helpful AI assistant for students at the University of Technology. Your task is to analyze the provided PDF document and answer questions based strictly on its content. Do not use any external knowledge. If the answer cannot be found within the document, clearly state that the information is not available in the provided material.`
            }
        });

        if (!response.text) {
             throw new Error("The API returned an empty response.");
        }

        return response.text;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get response from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};
