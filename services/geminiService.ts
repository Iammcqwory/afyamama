import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export function startChat(personalizedContext?: string): Chat {
  const instruction = personalizedContext 
    ? `${SYSTEM_INSTRUCTION}\n\nUSER CONTEXT:\n${personalizedContext}`
    : SYSTEM_INSTRUCTION;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: instruction,
      temperature: 0.5,
    },
  });
  return chat;
}
