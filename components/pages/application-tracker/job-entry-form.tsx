"use client";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import StatusSelect from "./status-select";
import WorkSetupSelect from "./work-setup-select";
import EmploymentTypeSelect from "./employment-type-select";
import { jobEntrySchema } from "@/lib/schema/application-tracker.schema";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { JobEntry } from "@/lib/types/job-entry";

type JobEntryFormProps = {
  defaultStatus?: string;
  onSuccess?: () => void;
  onJobCreated: (job: JobEntry) => void;
};

export default function JobEntryForm({
  defaultStatus,
  onSuccess,
  onJobCreated,
}: JobEntryFormProps) {
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
      const res = await fetch("/api/application-tracker/create-job-entry", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error("Failed to create job entry");
        return;
      }

      const { jobEntry } = await res.json();
      onJobCreated(jobEntry);

      toast.success("Job entry created");
      onSuccess?.();
    } catch (error) {
      console.error("An unexpected error occurred", error);
      toast.error("An unexpected error occurred");
    }
  };
  return (
    <form id="job-entry-form" onSubmit={handleSubmit}>
      <FieldSet>
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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="employment-type">Employment Type</FieldLabel>
              <EmploymentTypeSelect />
            </Field>
          </div>
        </FieldGroup>

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
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="contact">
                Contact
              </FieldLabel>
              <Input
                type="text"
                placeholder="e.g Mr. Ramirez - ramirez@gmail.com / 0995*******"
                name="contact"
                id="contact"
                className="border-2 border-foreground"
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
            />
          </div>
        </Field>

        {/* Status and Work Setup */}
        <FieldGroup>
          <div className="flex  md:flex-row flex-col items-stretch md:items-center gap-2 w-full">
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <StatusSelect defaultValue={defaultStatus} />
            </Field>

            <Field>
              <FieldLabel htmlFor="workSetup">Work Setup</FieldLabel>
              <WorkSetupSelect />
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
                defaultValue="PHP"
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
                defaultValue={0}
                className="border-2 border-foreground flex-1"
              />
            </Field>
          </div>
        </FieldGroup>

        {/* Job Link and Resume */}
        <FieldGroup>
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="jobLink">Job Link</FieldLabel>
              <Input
                type="text"
                name="jobLink"
                id="jobLink"
                placeholder="Enter job URL here..."
                className="border-2 border-foreground"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="resume">Resume</FieldLabel>
              <Input
                type="file"
                name="resume"
                id="resume"
                className="border-2 border-foreground cursor-pointer"
              />
            </Field>
          </div>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
          <Input
            type="text"
            name="additionalNotes"
            id="additionalNotes"
            placeholder="Type additional notes here..."
            className="border-2 border-foreground cursor-pointer"
          />
        </Field>
      </FieldSet>
    </form>
  );
}
