import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, username } = body;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return NextResponse.json({error: error.message}, {status: 400});
    }

    return NextResponse.json({success: true, message: "Successfully signed in"});
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: "An unexpected error occurred"}, {status: 500});
  }
}
