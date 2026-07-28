import { NextResponse } from "next/server";
import { GEMINI_MODELS } from "@/lib/gemini";

export async function GET() {
  return NextResponse.json({ defaultModel: "gemini-2.5-flash", models: GEMINI_MODELS });
}
