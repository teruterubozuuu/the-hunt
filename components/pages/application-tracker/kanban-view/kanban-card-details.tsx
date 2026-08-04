import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { JobEntry } from "@/lib/types/job-entry";
import Link from "next/link";
import React from "react";

type KanbanCardDetailsProps = {
  job: JobEntry;
};

export default function KanbanCardDetails({ job }: KanbanCardDetailsProps) {
  return (
    <DialogContent
      className="flex flex-col md:border-2 border-foreground md:rounded-lg! rounded-none! md:min-w-250 md:max-h-160 lg:max-h-190 max-h-screen max-w-screen p-5"
      initialFocus={false}
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">{job.job_title}</DialogTitle>
        <DialogDescription>{job.company_name}</DialogDescription>
      </DialogHeader>

      {/* Badges: Status, Work Setup, and Employment Type */}
      <div className="flex gap-1">
        <Badge className="py-3">{job.status}</Badge>
        <Badge className="py-3">{job.work_setup}</Badge>
        <Badge className="py-3">{job.employment_type}</Badge>
      </div>
      <div className="space-y-4 overflow-y-auto pr-4">
        <section className="flex gap-2">
          <Label htmlFor="contact" className="font-bold uppercase">
            Contact:
          </Label>
          <p className="whitespace-pre-wrap" id="contact">
            {job.contact ?? "N/A"}
          </p>
        </section>

        <section className="flex gap-2">
          <Label htmlFor="salary" className="font-bold uppercase">
            Salary:
          </Label>
          <p className="whitespace-pre-wrap" id="salary">
            {job.currency} {job.salary}
          </p>
        </section>

        <section>
          <Label
            htmlFor="job-description"
            className="font-bold uppercase border-b-2 pb-2"
          >
            Job Description
          </Label>
          <p className="whitespace-pre-wrap mt-2" id="job-description">
            {job.job_description}
          </p>
        </section>

        <section>
          <Label
            htmlFor="job-qualifications"
            className="font-bold uppercase border-b-2 pb-2"
          >
            Job Qualifications
          </Label>
          <p className="whitespace-pre-wrap mt-2" id="job-qualifications">
            {job.job_qualifications}
          </p>
        </section>

        <section>
          <Label
            htmlFor="benefits"
            className="font-bold uppercase border-b-2 pb-2"
          >
            Benefits
          </Label>
          <p className="whitespace-pre-wrap" id="benefits">
            {job.benefits ?? "N/A"}
          </p>
        </section>

        <section>
          <Label
            htmlFor="notes"
            className="font-bold uppercase border-b-2 pb-2"
          >
            Additional Notes
          </Label>
          <p className="whitespace-pre-wrap" id="notes">
            {job.notes ?? "N/A"}
          </p>
        </section>

        <section className="flex flex-wrap gap-2 items-center">
          <Label htmlFor="job-link" className="font-bold uppercase">
            Job Link:
          </Label>
          <Link href={job.job_link} className="hover:underline" target="_blank">
            {job.job_link}
          </Link>
        </section>

        <section>
          <Label
            htmlFor="resume"
            className="font-bold uppercase border-b-2 pb-2"
          >
            Resume
          </Label>
          {!job.resume?.length ? (
            <span>N/A</span>
          ) : (
            <iframe src={job.resume} className="w-full h-250 mt-2"></iframe>
          )}
        </section>
      </div>
    </DialogContent>
  );
}
