import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite" },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite" },
] as const;

export type GeminiModel = (typeof GEMINI_MODELS)[number]["id"];

export async function getGeminiApiKey() {
  const direct = process.env.GOOGLE_STUDIO_API_KEY ?? process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (direct) return direct;
  try {
    const env = await readFile(path.resolve(process.cwd(), "..", ".env"), "utf8");
    const entry = env.split(/\r?\n/).find((line) => line.trim().startsWith("GOOGLE_STUDIO_API_KEY="));
    return entry?.slice(entry.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "") ?? "";
  } catch {
    return "";
  }
}

export function isGeminiModel(value: unknown): value is GeminiModel {
  return typeof value === "string" && GEMINI_MODELS.some((model) => model.id === value);
}

export async function generateGeminiText({
  prompt,
  systemInstruction,
  temperature = 0.2,
  maxOutputTokens = 2048,
}: {
  prompt: string;
  systemInstruction: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");

  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown;
  for (const model of ["gemini-2.5-flash-lite", "gemini-2.5-flash"] as const) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens,
          thinkingConfig: { thinkingBudget: 512 },
        },
      });
      const text = response.text?.trim();
      if (text) return { text, model };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error("GEMINI_EMPTY_RESPONSE");
}
