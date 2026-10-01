"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { JobEntry } from "@/lib/types/job-entry";
import { status } from "@/utils/app/constants";
import JobDetails from "../job-details";
import CardDropdownMenu from "../card-dropdown-menu";
import AddJobEntryDialog from "../add-job-entry-dialog";
import AddJobEntryFromURL from "../add-job-entry-from-url-dialog";
import { Dispatch, SetStateAction, useState } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { CaretDoubleDownIcon, CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CaretDoubleUpIcon } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

type ListViewProps = {
  jobs: JobEntry[];
  onUpdate: (jobs: JobEntry) => void;
  onStatusChange: (
    jobId: string,
    newStatus: JobEntry["status"],
  ) => Promise<boolean>;
  onInterviewRequest: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  items: JobEntry[];
  setItems: Dispatch<SetStateAction<JobEntry[]>>;
  selectedJobId: string | null;
  onSelectedJobChange: (jobId: string | null) => void;
  totalByStatus: Record<JobEntry["status"], number>;
  onJobCreated: (job: JobEntry | null) => void;
  onLoadMore: (status: JobEntry["status"]) => Promise<void>;
};
export default function ListView({
  jobs,
  onUpdate,
  onStatusChange,
  onInterviewRequest,
  onDelete,
  items,
  setItems,
  selectedJobId,
  onSelectedJobChange,
  totalByStatus,
  onJobCreated,
  onLoadMore,
}: ListViewProps) {
  const view = "list";
  const [loadingStatus, setLoadingStatus] =
    useState<JobEntry["status"] | null>(null);

  return (
    <div className="h-screen overflow-y-auto md:pb-20 pb-40">
      {status.map((stat, statusIndex) => {
        const filteredJobs = items.filter((job) => job.status === stat.id);
        const previousStatus = status[statusIndex - 1];
        const nextStatus = status[statusIndex + 1];

        return (
          <Accordion key={stat.id} defaultValue={["applied"]}>
            <AccordionItem value={stat.id} className="py-1">
              <AccordionTrigger
                className={"cursor-pointer px-2  bg-primary text-secondary"}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold uppercase">{stat.type}</span>
                  <div
                    className="flex items-center"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <span className="pr-3 text-muted-foreground">
                      {totalByStatus[stat.id as JobEntry["status"]]}
                    </span>
                    <AddJobEntryDialog
                      defaultStatus={stat.id}
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
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2">
                {filteredJobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No jobs here</p>
                ) : (
                  <>
                    {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="py-2 border-b cursor-pointer hover:bg-muted transition-all"
                      onClick={() => onSelectedJobChange(job.id)}
                      title="View Details"
                    >
                      <div
                        className="flex justify-between items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="truncate min-w-0 font-semibold">
                          {job.job_title}
                        </p>

                        <CardDropdownMenu
                          job={job}
                          onDeleted={onDelete}
                          onUpdated={onUpdate}
                        />
                      </div>
                      <div className="flex flex-col pb-3">
                        <span className="text-sm text-muted-foreground">
                          {job.company_name}
                        </span>
                        {job.status === "applied" && (
                          <span className="text-sm text-muted-foreground">
                            Applied at{" "}
                            {job?.applied_at
                              ? job.applied_at.split("T")[0]
                              : ""}
                          </span>
                        )}
                      </div>
                      {job.additional_notes && (
                        <div
                          className="
              mt-2
              [&_ul]:list-disc
              [&_ul]:pl-6
              [&_ol]:list-decimal
              [&_ol]:pl-6
              [&_li]:my-1
            "
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              `<span><b>Note: </b></span>${job.additional_notes}` ||
                                "<p>N/A</p>",
                            ),
                          }}
                        />
                      )}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 flex-1 items-center">
                          <Badge>{job.work_setup}</Badge>
                          <Badge
                            className="truncate max-w-23 line-clamp-1"
                            title={job.employment_type}
                          >
                            {job.employment_type}
                          </Badge>
                        </div>
                        <div
                          className="flex shrink-0 items-center gap-1"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className={cn("cursor-pointer hover:bg-muted-foreground/50! px-5 border-2 border-foreground leading-none", !previousStatus ? "hidden" : "")}
                            title={
                              previousStatus
                                ? `Move back to ${previousStatus.type}`
                                : "Already at the first status"
                            }
                            aria-label={
                              previousStatus
                                ? `Move back to ${previousStatus.type}`
                                : "Already at the first status"
                            }
                            onClick={() => {
                              if (previousStatus) {
                                void onStatusChange(
                                  job.id,
                                  previousStatus.id as JobEntry["status"],
                                );
                              }
                            }}
                          >
                            <CaretDoubleUpIcon/>
                          </Button>
                          <Button
                            type="button"
                            size="xs"
                            className={cn("leading-none cursor-pointer px-5", !nextStatus ? "hidden" : "")}
                            title={
                              nextStatus
                                ? `Move to ${nextStatus.type}`
                                : "Already at the final status"
                            }
                            aria-label={
                              nextStatus
                                ? `Move to ${nextStatus.type}`
                                : "Already at the final status"
                            }
                            onClick={() => {
                              if (!nextStatus) return;

                              if (nextStatus.id === "interview") {
                                onInterviewRequest(job.id);
                                return;
                              }

                              void onStatusChange(
                                job.id,
                                nextStatus.id as JobEntry["status"],
                              );
                            }}
                          >
                            <CaretDoubleDownIcon/>
                          </Button>
                        </div>
                        <JobDetails
                          job={job}
                          onDelete={onDelete}
                          onUpdate={onUpdate}
                          open={job.id === selectedJobId}
                          onOpenChange={(open) => {
                            onSelectedJobChange(open ? job.id : null);
                          }}
                          view={view}
                        />
                      </div>
                    </div>
                    ))}
                  </>
                )}
                {totalByStatus[stat.id as JobEntry["status"]] >
                  filteredJobs.length && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2 cursor-pointer"
                    disabled={loadingStatus === stat.id}
                    onClick={async () => {
                      const jobStatus = stat.id as JobEntry["status"];
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
                    {loadingStatus === stat.id ? "Loading..." : "Load more"}
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
