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
    const { status, interviewAt } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status not found" },
        { status: 400 },
      );
    }

    // Get current job
    const { data: existingJob } = await supabase
      .from("job_entries")
      .select("applied_at, interview_at, job_title, company_name, status")
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
      interview_at?: string | null;
    } = { status };

    if (status === "applied" && !existingJob.applied_at) {
      updateData.applied_at = new Date().toISOString();
    }

    if (status === "interview") {
      if (!interviewAt) {
        return NextResponse.json(
          { success: false, message: "Interview date and time are required" },
          { status: 400 },
        );
      }

      updateData.interview_at = interviewAt;
    } else {
      updateData.interview_at = null;
    }

    if (existingJob.status === status) {
      return NextResponse.json(
        {
          jobStatus: [existingJob],
          success: true,
          message: "Status did not change",
        },
        { status: 200 },
      );
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

    const { error: activityError } = await supabase
      .from("activity_feed")
      .insert({
        user_id: user.id,
        job_entry_id: id,
        activity: `Status of ${existingJob.job_title} at ${existingJob.company_name} changed from ${existingJob.status} to ${updateData.status}`,
        link: `/application-tracker?jobId=${id}`,
      });

    if (activityError) {
      console.error("Failed to create activity", activityError);
      return NextResponse.json(
        { success: false, message: "Failed to create activity" },
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
