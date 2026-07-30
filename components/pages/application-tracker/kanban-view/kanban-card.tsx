"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { useDraggable } from "@dnd-kit/react";
import { EyeIcon } from "@phosphor-icons/react";
import React from "react";

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
      className="mt-2 border border-foreground cursor-grab hover:scale-105 hover:shadow-md transition-all ease-in-out"
    >
      <CardHeader>
        <CardTitle>{job.job_title}</CardTitle>
        <CardDescription>{job.company_name}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <span className="text-xs line-clamp-4">{job.job_description}</span>
        <div className="flex mt-2 justify-between items-center">
          <div className="flex gap-1">
            <Badge>{job.work_setup}</Badge>
            <Badge>{job.employment_type}</Badge>
          </div>
          <Dialog>
            <DialogTrigger className="bg-primary text-secondary py-1 px-3 rounded-md cursor-pointer hover:bg-primary/70 text-xs" title="View Details">
              <EyeIcon size={15}/>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
