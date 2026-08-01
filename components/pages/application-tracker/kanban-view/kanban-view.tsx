"use client";
import React, { useState } from "react";
import { KanbanContainer } from "./kanban-container";
import { DragDropProvider } from "@dnd-kit/react";
import { status } from "@/utils/app/constants";
import AddJobEntryDialog from "../add-job-entry-dialog";
import AddJobEntryFromURL from "../add-job-entry-from-url-dialog";
import { JobEntry } from "@/lib/types/job-entry";
import KanbanCard from "./kanban-card";

type KanbanViewProps = {
  jobs: JobEntry[];
};

type JobStatus = JobEntry["status"];

export default function KanbanView({ jobs }: KanbanViewProps) {
  const [items, setItems] = useState(jobs);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;
        const { source, target } = event.operation;
        if (!target || !source) return;
        setItems((prev) =>
          prev.map((j) =>
            j.id === source.id ? { ...j, status: target.id as JobStatus } : j,
          ),
        );
      }}
    >
      <div className="flex gap-2 items-start h-full min-h-0">
        {status.map((item) => (
          <KanbanContainer key={item.id} id={item.id}>
            <span className="font-semibold uppercase tracking-wide px-2">
              {item.type}
            </span>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1">
              {items
                .filter((job) => job?.status === item.id)
                .map((job) => (
                  <KanbanCard key={job.id} job={job} />
                ))}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <AddJobEntryDialog
                defaultStatus={item.id}
                onJobCreated={(newJob) => {
                  if (!newJob) return;
                  setItems((prev) => [...prev, newJob]);
                }}
              />
              <AddJobEntryFromURL />
            </div>
          </KanbanContainer>
        ))}
      </div>
    </DragDropProvider>
  );
}
