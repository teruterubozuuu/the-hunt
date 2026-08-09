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
import KanbanCardDetails from "./kanban-card-details";
import { EyeIcon } from "@phosphor-icons/react";
import CardDropdownMenu from "../card-dropdown-menu";
import Link from "next/link";

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
          <CardTitle className="text-sm flex-1/2 line-clamp-2">{job.job_title}</CardTitle>
          <CardDropdownMenu
            job={job}
            onDeleted={onDeleted}
            onUpdated={onUpdated}
          />
        </div>
        <CardDescription>{job.company_name}</CardDescription>
        {job.status === "applied" && (
          <span className="text-xs text-muted-foreground">
            Applied at {job?.applied_at ? job.applied_at.split("T")[0] : "" }
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-col">
        <Link href={job.job_link} className="text-xs line-clamp-2 text-ellipsis mb-2 opacity-70 hover:opacity-100 hover:underline" target="_blank">{job.job_link}</Link>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <Badge>{job.work_setup}</Badge>
            <Badge className="truncate max-w-23 line-clamp-1" title={job.employment_type}>{job.employment_type}</Badge>
          </div>
          <Dialog>
            <DialogTrigger
              className="bg-primary text-secondary py-1 px-3 rounded-md cursor-pointer hover:bg-primary/70 text-xs"
              title="View Details"
            >
              <EyeIcon size={15} />
            </DialogTrigger>
            <KanbanCardDetails job={job} />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
