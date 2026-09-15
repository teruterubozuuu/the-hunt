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
import Link from "next/link";
import AddJobEntryDialog from "../add-job-entry-dialog";
import AddJobEntryFromURL from "../add-job-entry-from-url-dialog";
import { Dispatch, SetStateAction, useState } from "react";
import DOMPurify from "dompurify";

type ListViewProps = {
  jobs: JobEntry[];
  onUpdate: (jobs: JobEntry) => void;
  onDelete: (jobId: string) => void;
  items: JobEntry[];
  setItems: Dispatch<SetStateAction<JobEntry[]>>;
};
export default function ListView({
  jobs,
  onUpdate,
  onDelete,
  items,
  setItems,
}: ListViewProps) {
  const view = "list";

  return (
    <div className="h-screen overflow-y-auto md:pb-20 pb-40">
      {status.map((stat) => {
        const filteredJobs = items.filter((job) => job.status === stat.id);

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
                      {filteredJobs.length}
                    </span>
                    <AddJobEntryDialog
                      defaultStatus={stat.id}
                      onJobCreated={(newJob) => {
                        if (!newJob) {
                          setItems((prev) => [...prev, newJob]);
                        }
                      }}
                      view={view}
                    />
                    <AddJobEntryFromURL
                      onJobCreated={(newJob) => {
                        if (!newJob) {
                          setItems((prev) => [...prev, newJob]);
                        }
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
                  filteredJobs.map((job) => (
                    <div key={job.id} className="py-2 border-b">
                      <div className="flex justify-between items-center">
                        <Link
                          className="font-medium hover:underline! no-underline!"
                          href={job.job_link}
                          rel="noopen noreferrer"
                          title={job.job_link}
                        >
                          {job.job_title}
                        </Link>
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
                        <div className="flex gap-1">
                          <Badge>{job.work_setup}</Badge>
                          <Badge
                            className="truncate max-w-23 line-clamp-1"
                            title={job.employment_type}
                          >
                            {job.employment_type}
                          </Badge>
                        </div>

                        <JobDetails
                          job={job}
                          onDelete={onDelete}
                          onUpdate={onUpdate}
                        />
                      </div>
                    </div>
                  ))
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
