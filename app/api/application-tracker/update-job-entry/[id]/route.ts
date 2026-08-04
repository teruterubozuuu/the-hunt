import { jobEntrySchema } from "@/lib/schema/application-tracker.schema";
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

    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());

    const result = jobEntrySchema.partial().safeParse(raw);

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

    const updateData = result.data;

    // Resume Update
    let resumePath: string | undefined;

    if (updateData.resume instanceof File && updateData.resume.size > 0) {
      if (updateData.resume.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, message: "Resume must be a PDF" },
          { status: 400 },
        );
      }

      const fileExt = "pdf";
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase
        .from("resumes")
        .upload(filePath, updateData.resume, {
          contentType: updateData.resume.type,
        });

      if (uploadError) {
        return NextResponse.json(
          { success: false, message: "Upload failed" },
          { status: 500 },
        );
      }

      resumePath = filePath;
    }

    /**
     * Only include resume if updated
     * - Takes all the fields the user sent (updateData),
     *   and only adds resume if a new resume was uploaded
     */
    const finalData = {
      ...(updateData.jobTitle && { job_title: updateData.jobTitle }),
      ...(updateData.employmentType && {
        employment_type: updateData.employmentType,
      }),
      ...(updateData.companyName && { company_name: updateData.companyName }),
      ...(updateData.contact && { contact: updateData.contact }),
      ...(updateData.jobDescription && {
        job_description: updateData.jobDescription,
      }),
      ...(updateData.jobQualifications && {
        job_qualifications: updateData.jobQualifications,
      }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.workSetup && { work_setup: updateData.workSetup }),
      ...(updateData.currency && { currency: updateData.currency }),
      ...(updateData.salary && { salary: Number(updateData.salary) }),
      ...(updateData.jobLink && { job_link: updateData.jobLink }),
      ...(resumePath && { resume: resumePath }),
    };

    /**
     * Update Database
     * - Ownership check inside query
     */
    const { data: jobEntry, error } = await supabase
      .from("job_entries")
      .update(finalData)
      .eq("id", id)
      .select();

    if (!jobEntry || jobEntry.length === 0) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );
    }

    if (error) {
      console.error(error);
      return NextResponse.json(
        { succcess: false, message: "Update failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { jobEntry: jobEntry[0], success: true, message: "Successfully updated entry" },
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
