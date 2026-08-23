import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Authorize user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Job ID not found" },
        { status: 404 },
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or missing request body" },
        { status: 400 },
      );
    }
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status not found" },
        { status: 400 },
      );
    }

    // Get current job
    const { data: existingJob } = await supabase
      .from("job_entries")
      .select("applied_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingJob) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 },
      );
    }

    /**
     * Start with status in updateData.
     * If the job is moved to "applied" and it doesn't have an applied_at yet,
     * add applied_at with the current timestamp.
     */
    const updateData: {
      status: string;
      applied_at?: string;
    } = { status };

    if (status === "applied" && !existingJob.applied_at) {
      updateData.applied_at = new Date().toISOString();
    }

    /**
     * Update Database
     */

    const { data: jobStatus, error } = await supabase
      .from("job_entries")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { succcess: false, message: "Job status update failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { jobStatus, success: true, message: "Successfully updated job status" },
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
