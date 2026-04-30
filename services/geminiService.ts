import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export function startChat(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.5,
    },
  });
  return chat;
}
