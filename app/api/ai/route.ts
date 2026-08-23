import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: "Explain how AI works in a few words",
        });

        console.log(interaction.output_text);
    } catch (error) {
        console.log(error);
        return NextResponse.json({success:false, message: "An unexpected error occurred"}, {status: 500});
    }
}