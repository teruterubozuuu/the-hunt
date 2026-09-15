"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
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
  onDelete: (jobId: string) => void;
  onUpdate: (jobs: JobEntry) => void;
  onDragEnd: (e: DragEndEvent) => void;
  items: JobEntry[];
  setItems: Dispatch<SetStateAction<JobEntry[]>>;
};

export default function KanbanView({
  jobs,
  onDelete,
  onUpdate,
  items,
  setItems,
  onDragEnd,
}: KanbanViewProps) {
  const view = "kanban";

  return (
    <DragDropProvider onDragEnd={onDragEnd}>
      <div className="flex gap-2 items-start h-full min-h-0">
        {status.map((item) => {
          const filteredJobs = items.filter((job) => job?.status === item.id);

          return (
            <KanbanContainer key={item.id} id={item.id}>
              <div className="flex justify-between px-2">
                <span className="font-semibold uppercase tracking-wide">
                  {item.type}
                </span>
                <span className="text-muted-foreground">{filteredJobs.length}</span>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                {filteredJobs.length === 0 ? (
                  <div className="flex h-full items-center text-sm bg-muted text-muted-foreground p-4 mt-2 rounded-lg">
                    No applications here
                  </div>
                ) : (
                  filteredJobs
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
                  view={view}
                />
                <AddJobEntryFromURL
                  onJobCreated={(newJob) => {
                    if (!newJob) return;
                    setItems((prev) => [...prev, newJob]);
                  }}
                  view={view}
                />
              </div>
            </KanbanContainer>
          );
        })}
      </div>
    </DragDropProvider>
  );
}
