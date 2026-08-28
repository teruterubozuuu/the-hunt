"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { JobEntry } from "@/lib/types/job-entry";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import CardDropdownMenu from "./card-dropdown-menu";
import { EyeIcon, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type JobDetailsProps = {
  job: JobEntry;
  onDelete: (jobId: string) => void;
  onUpdate: (job: JobEntry) => void;
};

export default function JobDetails({
  job,
  onDelete,
  onUpdate,
}: JobDetailsProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      if (!job.resume) return;
      try {
        const res = await fetch(
          `/api/application-tracker/get-resume-url?path=${encodeURIComponent(job.resume)}`,
        );

        if (!res.ok) {
          toast.error(`Failed to fetch resume URL: ${res.status}`);
          setResumeUrl(null);
          return;
        }

        const data = await res.json();
        setResumeUrl(data.url ?? null);
      } catch (err) {
        console.error(err);
        setResumeUrl(null);
      }
    };
    fetchUrl();
  }, [job.resume]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="bg-primary text-secondary py-1 px-3 rounded-md cursor-pointer hover:bg-primary/70 text-xs"
        title="View Details"
      >
        <EyeIcon size={15} />
      </DialogTrigger>
      <DialogContent
        className="flex flex-col md:border-2 border-foreground md:rounded-lg! rounded-none! md:min-w-250 md:max-h-160 lg:max-h-190 max-h-screen max-w-screen px-5"
        initialFocus={false}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-bold">
              <Link
                href={job.job_link}
                className="hover:underline"
                target="_blank"
              >
                {job.job_title}
              </Link>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <CardDropdownMenu
                job={job}
                onDeleted={onDelete}
                onUpdated={onUpdate}
              />
              <Button 
                className="cursor-pointer bg-transparent hover:bg-primary/10 text-primary p-1! rounded-md h-auto!"
                onClick={()=>setOpen(false)}
              >
                <X size={15} />
              </Button>
            </div>
          </div>
          <DialogDescription className="flex flex-col gap-1">
            {job.company_name}
            <Link href={job.company_website || "#"}>
              {job.company_website || ""}
            </Link>
            {job.company_location || ""}
          </DialogDescription>
        </DialogHeader>

        {/* Badges: Status, Work Setup, and Employment Type */}
        <div className="flex gap-1">
          <Badge className="py-3">{job.status}</Badge>
          <Badge className="py-3">{job.work_setup}</Badge>
          <Badge className="py-3">{job.employment_type}</Badge>
        </div>
        <div className="space-y-4 overflow-y-auto pr-4">
          <div className="flex justify-between">
            <section className="flex gap-2">
              <Label htmlFor="contact" className="font-bold uppercase">
                Contact:
              </Label>
              <p className="whitespace-pre-wrap" id="contact">
                {job.contact || "N/A"}
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
          </div>

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
              {job.additional_notes ?? "N/A"}
            </p>
          </section>

          <section>
            <Label
              htmlFor="resume"
              className="font-bold uppercase border-b-2 pb-2"
            >
              Resume
            </Label>
            {resumeUrl ? (
              <iframe
                src={resumeUrl}
                className="w-full h-250 mt-2"
                title="Resume preview"
              />
            ) : (
              <p>Loading resume...</p>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
