import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const EXPIRES_IN = 60 * 60 // 1 hour

    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(path, 60 * 60); // 1 hour

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to generate URL" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { url: data.signedUrl }, 
      {headers: {"Cache-Control": `private, max-age=${EXPIRES_IN - 300}`}} // 55 min
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}