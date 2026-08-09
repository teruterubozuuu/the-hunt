"use client";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusSelect from "./status-select";
import WorkSetupSelect from "./work-setup-select";
import EmploymentTypeSelect from "./employment-type-select";
import { jobEntrySchema } from "@/lib/schema/application-tracker.schema";
import { toast } from "sonner";
import { FormEvent, useEffect, useState } from "react";
import { JobEntry } from "@/lib/types/job-entry";

type JobEntryFormProps = {
  defaultStatus?: string;
  onSuccess?: () => void;
  onSubmit: (job: JobEntry) => void;
  job?: JobEntry;
};

export default function JobEntryForm({
  defaultStatus,
  onSuccess,
  onSubmit,
  job,
}: JobEntryFormProps) {
  const isEdit = Boolean(job?.id);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string | undefined>(
    job?.status ?? defaultStatus,
  );

  useEffect(() => {
    if (!resumeFile) return;

    const url = URL.createObjectURL(resumeFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url); // cleanup
  }, [resumeFile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const raw = Object.fromEntries(formData.entries());
    const result = jobEntrySchema.safeParse(raw);

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      toast.error("Failed to validate form");
      return;
    }

    try {
      const url = isEdit
        ? `/api/application-tracker/update-job-entry/${job!.id}`
        : "/api/application-tracker/create-job-entry";

      console.log("PATCH URL:", url);

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error(
          isEdit ? "Failed to update job entry" : "Failed to create job entry",
        );
        return;
      }

      const { jobEntry } = await res.json();
      onSubmit(jobEntry);

      toast.success(isEdit ? "Job entry updated" : "Job entry created");
      onSuccess?.();
    } catch (error) {
      console.error("An unexpected error occurred", error);
      toast.error("An unexpected error occurred");
    }
  };
  return (
    <form id="job-entry-form" onSubmit={handleSubmit}>
      <FieldSet>
        {/* Company Name and person to contact */}
        <FieldGroup>
          <div className="flex  md:flex-row flex-col items-center gap-2">
            <Field>
              <FieldLabel htmlFor="companyName">
                Company Name <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                type="text"
                name="companyName"
                id="companyName"
                placeholder="e.g TechZ"
                className="border-2 border-foreground"
                defaultValue={job?.company_name}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact">Contact</FieldLabel>
              <Input
                type="text"
                placeholder="e.g Mr. Ramirez - ramirez@gmail.com / 0995*******"
                name="contact"
                id="contact"
                className="border-2 border-foreground"
                defaultValue={job?.contact}
              />
            </Field>
          </div>
        </FieldGroup>

        {/* Job Title and Employment Type */}
        <FieldGroup>
          <div className=" flex md:flex-row flex-col items-center gap-2">
            <Field>
              <FieldLabel htmlFor="jobTitle">
                Job Title <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                type="text"
                name="jobTitle"
                id="jobTitle"
                placeholder="e.g Junior Web Developer"
                className="border-2 border-foreground"
                defaultValue={job?.job_title}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="employment-type">Employment Type</FieldLabel>
              <EmploymentTypeSelect defaultValue={job?.employment_type} />
            </Field>
          </div>
        </FieldGroup>

        {/* Status and Work Setup */}
        <FieldGroup>
          <div className="flex  md:flex-row flex-col items-stretch md:items-center gap-2 w-full">
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <StatusSelect
                defaultValue={job?.status ?? defaultStatus}
                onValueChange={setStatus}
              />
            </Field>

            {status === "applied" && (
              <Field>
                <FieldLabel htmlFor="appliedDate">Applied Date</FieldLabel>
                <Input
                  type="date"
                  name="appliedDate"
                  id="appliedDate"
                  className="border-2 border-foreground"
                  defaultValue={
                    job?.applied_at ? job.applied_at.split("T")[0] : ""
                  }
                  required
                />
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="workSetup">Work Setup</FieldLabel>
              <WorkSetupSelect defaultValue={job?.work_setup} />
            </Field>
          </div>
        </FieldGroup>

        {/* Currency and Salary */}
        <FieldGroup>
          <div className="flex gap-2">
            <Field className="flex-1/6">
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Input
                type="text"
                name="currency"
                id="currency"
                placeholder="PHP"
                defaultValue={job?.currency ?? "PHP"}
                className="border-2 border-foreground"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="salary">Salary</FieldLabel>
              <Input
                type="number"
                name="salary"
                id="salary"
                placeholder="30,000"
                defaultValue={job?.salary ?? 0}
                className="border-2 border-foreground flex-1"
              />
            </Field>
          </div>
        </FieldGroup>

        {/* Job Description */}
        <Field>
          <FieldLabel htmlFor="jobDescription">
            Job Description <span className="text-red-600">*</span>
          </FieldLabel>
          <div className="grid w-full">
            <Textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Enter job description here..."
              className="border-2 border-foreground resize-none min-h-30"
              defaultValue={job?.job_description}
              required
            />
          </div>
        </Field>

        {/* Job Qualifications */}
        <Field>
          <FieldLabel htmlFor="jobQualifications">
            Job Qualifications <span className="text-red-600">*</span>
          </FieldLabel>
          <div className="grid w-full">
            <Textarea
              id="jobQualifications"
              name="jobQualifications"
              placeholder="Enter job qualifications here..."
              className="border-2 border-foreground resize-none min-h-30"
              defaultValue={job?.job_qualifications}
              required
            />
          </div>
        </Field>

        {/* Benefits */}
        <Field>
          <FieldLabel htmlFor="benefits">Benefits</FieldLabel>
          <div className="grid w-full">
            <Textarea
              id="benefits"
              name="benefits"
              placeholder="Enter job benefits here..."
              className="border-2 border-foreground resize-none min-h-30"
              defaultValue={job?.benefits}
            />
          </div>
        </Field>

        {/* Additional Notes */}
        <Field>
          <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
          <div className="grid w-full">
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Type additional notes here..."
              className="border-2 border-foreground resize-none min-h-30"
              defaultValue={job?.notes}
            />
          </div>
        </Field>

        {/* Job Link */}
        <Field>
          <FieldLabel htmlFor="jobLink">Job Link</FieldLabel>
          <Input
            type="text"
            name="jobLink"
            id="jobLink"
            placeholder="Enter job URL here..."
            className="border-2 border-foreground"
            defaultValue={job?.job_link}
          />
        </Field>

        {/* Resume */}
        <Field>
          <FieldLabel htmlFor="resume">Resume</FieldLabel>
          <Input
            type="file"
            accept=".pdf, application/pdf"
            name="resume"
            id="resume"
            className="border-2 border-foreground cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setResumeFile(file);
            }}
          />
        </Field>

        {/* Resume Preview */}
        {previewUrl && (
          <iframe src={previewUrl} className="w-full h-250 mt-2"></iframe>
        )}
      </FieldSet>
    </form>
  );
}
