import { jobEntrySchema } from "@/lib/schema/application-tracker.schema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

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

  // Parse multipart form data instead of JSON
  const formData = await req.formData();
  const raw = Object.fromEntries(formData.entries());

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

  const {
    jobTitle,
    employmentType,
    companyName,
    contact,
    jobDescription,
    jobQualifications,
    status,
    workSetup,
    currency,
    salary,
    jobLink,
    resume,
  } = result.data;

  try {
    let resumeUrl: string | null = null;

    if (resume instanceof File && resume.size > 0) {
      // Guard against unexpected file types/sizes
      if (resume.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, message: "Resume must be a PDF" },
          { status: 400 },
        );
      }

      const fileExt = resume.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

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

      const { data: signedData, error: signedError } = await supabase.storage
        .from("resumes")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7-day expiry

      if (signedError) {
        console.error(signedError);
        return NextResponse.json(
          { success: false, message: "Failed to generate resume URL" },
          { status: 500 },
        );
      }

      resumeUrl = signedData?.signedUrl ?? null;
    }

    const { data: jobEntry, error: jobEntryError } = await supabase
      .from("job_entries")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        employment_type: employmentType,
        company_name: companyName,
        contact,
        job_description: jobDescription,
        job_qualifications: jobQualifications,
        status,
        work_setup: workSetup,
        currency,
        salary,
        job_link: jobLink,
        resume: resumeUrl,
      })
      .select()
      .single()

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
