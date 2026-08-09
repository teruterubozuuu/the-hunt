import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const formData = await req.formData();
    const newPassword = formData.get("new-password") as string;

    if (!newPassword || newPassword.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "New password is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Failed to update password" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Password successfully updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
