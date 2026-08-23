import { jobEntrySchema } from "@/lib/schema/application-tracker.schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies(); // gets the user's session cookies for SSR auth
    const supabase = createClient(cookieStore); // creates a server-side client

    // Check if user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Stop everything if there's no user
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Parse multipart form data instead of JSON
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());

    // Validate input using schema from zod
    const result = jobEntrySchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Extract valid data
    const {
      jobTitle,
      employmentType,
      companyName,
      companyWebsite,
      location,
      contact,
      jobDescription,
      jobQualifications,
      status,
      workSetup,
      currency,
      salary,
      jobLink,
      resume,
      appliedDate,
    } = result.data;

    /**
     * Handle resume upload
     * Only proceed if:
     * - A file exists
     * - It's not empty
     */
    let resumePath: string | null = null;

    /**
     * Validate file
     * - Only allow pdfs
     * - Prevent users from uploading random files
     */
    if (resume instanceof File && resume.size > 0) {
      // Guard against unexpected file types/sizes
      if (resume.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, message: "Resume must be a PDF" },
          { status: 400 },
        );
      }

      const fileExt = "pdf";
      /**
       * Create unique file path
       * - Files are grouped per user (user.id);
       * - randomUUID() prevents filename collisions
       */
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      /**
       * Upload to Supabase Storage
       * - Bucket: "resumes"
       * - Path: "userId/random-file.pdf"
       */
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resume, {
          contentType: resume.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        return NextResponse.json(
          { success: false, message: "Failed to upload resume" },
          { status: 500 },
        );
      }

      resumePath = filePath;
    }

    /**
     * Insert into Database
     * - Inserts a new row into job_entries
     * - Stores: job info, resume URL
     * - .select().single() returns the inserted row
     */
    const { data: jobEntry, error: jobEntryError } = await supabase
      .from("job_entries")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        employment_type: employmentType,
        company_name: companyName,
        company_website: companyWebsite,
        company_location: location,
        contact,
        job_description: jobDescription,
        job_qualifications: jobQualifications,
        status,
        work_setup: workSetup,
        currency,
        salary,
        job_link: jobLink,
        resume: resumePath,
        applied_at: appliedDate,
      })
      .select()
      .single();

    if (jobEntryError) {
      console.error("jobEntryError:", jobEntryError);
      return NextResponse.json(
        { success: false, message: "An unexpected error occurred" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { jobEntry, success: true, message: "Job Entry created" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
