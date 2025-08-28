import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Load stored PDF (only once at startup)
const handbookPath = path.resolve(__dirname, "../data/StudentHandbook.pdf");
const handbookBuffer = fs.readFileSync(handbookPath);
const handbookBase64 = handbookBuffer.toString("base64");

export const askWithHandbook = async (prompt: string): Promise<string> => {
    try {
        const filePart = {
            inlineData: {
                mimeType: "application/pdf",
                data: handbookBase64,
            },
        };

        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [filePart, textPart] },
            config: {
                systemInstruction: `You are a helpful AI assistant for students at the University of Technology. 
Your task is to analyze the provided PDF document and answer questions strictly based on its content. 
Do not use any external knowledge. If the answer cannot be found within the document, clearly state that the information is not available in the provided material.

When answering, always format your response in **clear markdown style** with:
- Headings for sections
- Bullet points for steps
- Bold key terms or important phrases
- Concise, easy-to-read structure`,
            },
        });

        if (!response.text) {
            throw new Error("The API returned an empty response.");
        }

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error(
            error instanceof Error
                ? `Failed to get response from AI: ${error.message}`
                : "An unknown error occurred while communicating with the AI."
        );
    }
};
