"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { useDraggable } from "@dnd-kit/react";
import JobDetails from "../job-details";
import { EyeIcon } from "@phosphor-icons/react";
import CardDropdownMenu from "../card-dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

type KanbanCardProps = {
  job: JobEntry;
  onDeleted: (jobId: string) => void;
  onUpdated: (job: JobEntry) => void;
};

export default function KanbanCard({
  job,
  onDeleted,
  onUpdated,
}: KanbanCardProps) {
  const { ref } = useDraggable({
    id: job.id,
  });

  return (
    <Card
      ref={ref}
      className="mt-2 border border-foreground cursor-grab hover:shadow-md transition-all ease-in-out"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm flex-1/2 line-clamp-2">
            <Link
              href={job.job_link}
              className="hover:underline"
              target="_blank"
              title={job.job_link}
            >
              {job.job_title}
            </Link>
          </CardTitle>
          <CardDropdownMenu
            job={job}
            onDeleted={onDeleted}
            onUpdated={onUpdated}
          />
        </div>
        <CardDescription>
          <Link
            href={job.company_website ?? "#"}
            className={job.company_website ? "hover:underline" : ""}
            target="_blank"
            rel="noopen noreferrer"
          >
            {job.company_name}
          </Link>
        </CardDescription>
        {job.status === "applied" && (
          <span className="text-xs text-muted-foreground">
            Applied at {job?.applied_at ? job.applied_at.split("T")[0] : ""}
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-col">
        {job.additional_notes && (
          <p className="mb-2">
            <b>Note:</b> {job.additional_notes}
          </p>
        )}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <Badge>{job.work_setup}</Badge>
            <Badge
              className="truncate max-w-23 line-clamp-1"
              title={job.employment_type}
            >
              {job.employment_type}
            </Badge>
          </div>

          <JobDetails job={job} onDelete={onDeleted} onUpdate={onUpdated} />
        </div>
      </CardContent>
    </Card>
  );
}
