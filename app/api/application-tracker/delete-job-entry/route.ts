import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const body = await req.json();
    const { jobId } = body;

    console.log(jobId)

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Job ID is missing" },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("job_entries")
      .delete()
      .eq("id", jobId)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, message: "Failed to delete job entry" },
        { status: 500 },
      );
    }

    if (!data) {
      // RLS blocked it, or no row matched this id
      return NextResponse.json(
        { success: false, message: "No job entry deleted — check permissions" },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { data, success: true, message: "Job entry deleted" },
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
