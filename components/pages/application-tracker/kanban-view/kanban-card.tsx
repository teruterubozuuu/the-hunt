"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { useDraggable } from "@dnd-kit/react";
import { EyeIcon } from "@phosphor-icons/react";
import KanbanCardDetails from "./kanban-card-details";

type KanbanCardProps = {
  job: JobEntry;
};

export default function KanbanCard({ job }: KanbanCardProps) {
  const { ref } = useDraggable({
    id: job.id,
  });

  return (
    <Card
      ref={ref}
      className="mt-2 border border-foreground cursor-grab hover:shadow-md transition-all ease-in-out"
    >
      <CardHeader>
        <CardTitle>{job.job_title}</CardTitle>
        <CardDescription>{job.company_name}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <Badge>{job.work_setup}</Badge>
            <Badge>{job.employment_type}</Badge>
          </div>
          <Dialog>
            <DialogTrigger className="bg-primary text-secondary py-1 px-3 rounded-md cursor-pointer hover:bg-primary/70 text-xs" title="View Details">
              <EyeIcon size={15}/>
            </DialogTrigger>
              <KanbanCardDetails job={job}/>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
