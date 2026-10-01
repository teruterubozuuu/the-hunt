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
import { Button } from "@/components/ui/button";
import { CaretDownIcon } from "@phosphor-icons/react";

type KanbanViewProps = {
  jobs: JobEntry[];
  onDelete: (jobId: string) => void;
  onUpdate: (jobs: JobEntry) => void;
  onDragEnd: (e: DragEndEvent) => void;
  items: JobEntry[];
  setItems: Dispatch<SetStateAction<JobEntry[]>>;
selectedJobId: string | null;
onSelectedJobChange: (jobId: string | null) => void;
  totalByStatus: Record<JobEntry["status"], number>;
  onJobCreated: (job: JobEntry | null) => void;
  onLoadMore: (status: JobEntry["status"]) => Promise<void>;
};

export default function KanbanView({
  jobs,
  onDelete,
  onUpdate,
  items,
  setItems,
  onDragEnd,
  selectedJobId,
  onSelectedJobChange,
  totalByStatus,
  onJobCreated,
  onLoadMore,
}: KanbanViewProps) {
  const view = "kanban";
  const [loadingStatus, setLoadingStatus] = useState<JobEntry["status"] | null>(null);

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
                <span className="text-muted-foreground">
                  {totalByStatus[item.id as JobEntry["status"]]}
                </span>
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
                        dialogOpen={job.id === selectedJobId}
                        onDialogChange={(open) => {
                          onSelectedJobChange(open ? job.id : null);
                        }}                      />
                    ))
                )}
              </div>

              {totalByStatus[item.id as JobEntry["status"]] >
                filteredJobs.length && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 cursor-pointer"
                  disabled={loadingStatus === item.id}
                  onClick={async () => {
                    const jobStatus = item.id as JobEntry["status"];
                    setLoadingStatus(jobStatus);
                    try {
                      await onLoadMore(jobStatus);
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to load more job entries");
                    } finally {
                      setLoadingStatus(null);
                    }
                  }}
                >
                  <CaretDownIcon />
                  {loadingStatus === item.id ? "Loading..." : "Load more"}
                </Button>
              )}

              <div className="flex items-center gap-2 mt-2">
                <AddJobEntryDialog
                  defaultStatus={item.id}
                  onJobCreated={(newJob) => {
                    if (!newJob) return;
                    onJobCreated(newJob);
                  }}
                  view={view}
                />
                <AddJobEntryFromURL
                  onJobCreated={(newJob) => {
                    if (!newJob) return;
                    onJobCreated(newJob);
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
