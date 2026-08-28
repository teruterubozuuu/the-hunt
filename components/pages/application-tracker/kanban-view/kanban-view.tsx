"use client";
import React, { useState } from "react";
import { KanbanContainer } from "./kanban-container";
import {
  DragDropEventHandlers,
  DragDropProvider,
  DragEndEvent,
} from "@dnd-kit/react";
import { status } from "@/utils/app/constants";
import AddJobEntryDialog from "../add-job-entry-dialog";
import AddJobEntryFromURL from "../add-job-entry-from-url-dialog";
import { JobEntry } from "@/lib/types/job-entry";
import KanbanCard from "./kanban-card";
import { toast } from "sonner";

type KanbanViewProps = {
  jobs: JobEntry[];
  onDelete: (jobId: string)=> void;
  onUpdate: (jobs: JobEntry)=> void;
};

type JobStatus = JobEntry["status"];

export default function KanbanView({ jobs, onDelete, onUpdate }: KanbanViewProps) {
  const [items, setItems] = useState(jobs);


  const handleDragEnd = async (e: DragEndEvent) => {
    if (e.canceled) return;
    const { source, target } = e.operation;
    if (!target || !source) return;

    const jobId = source.id;
    const newStatus = target.id as JobStatus;

    const prevItems = items;

    const updatedItems = items.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job,
    );

    setItems(updatedItems);

    try {
      const res = await fetch(
        `/api/application-tracker/update-job-status/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.jobStatus?.[0]) {
        setItems((prev) =>
          prev.map((j) => (j.id === jobId ? data.jobStatus[0] : j)),
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job status");
      setItems(prevItems);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className="flex gap-2 items-start h-full min-h-0">
        {status.map((item) => (
          <KanbanContainer key={item.id} id={item.id}>
            <span className="font-semibold uppercase tracking-wide px-2">
              {item.type}
            </span>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              {items.filter((job) => job?.status === item.id).length === 0 ? (
                <div className="flex h-full items-center text-sm bg-muted text-muted-foreground p-4 mt-2 rounded-lg">
                  No applications here
                </div>
              ) : (
                items
                  .filter((job) => job?.status === item.id)
                  .map((job) => (
                    <KanbanCard
                      key={job.id}
                      job={job}
                      onDeleted={onDelete}
                      onUpdated={onUpdate}
                    />
                  ))
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <AddJobEntryDialog
                defaultStatus={item.id}
                onJobCreated={(newJob) => {
                  if (!newJob) return;
                  setItems((prev) => [...prev, newJob]);
                }}
              />
              <AddJobEntryFromURL 
                onJobCreated={(newJob) => {
                  if (!newJob) return;
                  setItems((prev)=> [...prev, newJob])
                }}
              />
            </div>
          </KanbanContainer>
        ))}
      </div>
    </DragDropProvider>
  );
}
