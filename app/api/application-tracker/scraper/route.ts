import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { siteUrl } = await req.json();

    if (!siteUrl) {
      return NextResponse.json(
        { success: false, message: "Missing URL" },
        { status: 400 },
      );
    }

    const res = await fetch(siteUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Fetch failed" },
        { status: 500 },
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // smarter extraction
    const title =
      $("h1").first().text() ||
      $('meta[property="og:title"]').attr("content") ||
      "";

    const rawText =
      $("#jobDescriptionText").text() ||
      $(".jobsearch-jobDescriptionText").text() ||
      $("main").text() ||
      $("body").text();

    const prompt = `
You are extracting structured job data for a database.

Return ONLY valid JSON. Do NOT include explanations or extra text.

Follow this exact schema:

{
  "job_title": string,
  "employment_type": "full-time" | "part-time" | "contract" | "contract-to-hire" | "internship" | "temporary" | "freelance",
  "company_name": string,
  "location": string,
  "company_website": string,
  "contact": string,
  "job_description": string,
  "job_qualifications": string,
  "status": "to-apply",
  "work_setup": "onsite" | "hybrid" | "remote",
  "currency": string,
  "salary": string,
  "job_link": string,
  "benefits": string,
  "additional_notes": string
}

STRICT RULES:

- NEVER return null
- Use empty string "" if unknown
- Use [] only if explicitly required (none here)
- "status" must ALWAYS be "to-apply"
- "job_link" MUST be the provided URL: ${siteUrl}

FIELD INSTRUCTIONS:

- job_title → extract or use provided title if available
- employment_type → infer from words like "full-time", "contract", etc.
- company_name → extract company name (do not guess randomly)
- location → extract city/country if available
- company_website → extract official website if mentioned, else ""
- contact → email or recruiter name if present, else ""
- job_description → summarize the role clearly (2–4 sentences)
- job_qualifications → summarize requirements/skills into a paragraph
- work_setup → infer:
    remote → if "remote", "work from home"
    hybrid → if mixed
    onsite → default if unclear
- currency → detect from salary (e.g. PHP, USD), else ""
- salary → extract if present, else ""
- benefits → extract perks if mentioned
- additional_notes → any extra useful info

Be smart and infer missing values when reasonable.

Job Title (if known): ${title}

Job Content:
${rawText}
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt,
    });

    let parsed;

    try {
      parsed = JSON.parse(interaction.output_text as string);
    } catch {
      return NextResponse.json(
        {
          success: true,
          data: {
            job_title: title,
            description: rawText.slice(0, 500),
          },
          warning: "AI parsing failed, partial data returned",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unexpected error" },
      { status: 500 },
    );
  }
}
