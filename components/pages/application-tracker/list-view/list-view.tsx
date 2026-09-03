import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { cn } from "@/lib/utils";
import { status } from "@/utils/app/constants";
import { EyeIcon } from "@phosphor-icons/react";
import JobDetails from "../job-details";
import CardDropdownMenu from "../card-dropdown-menu";
import Link from "next/link";

type ListViewProps = {
  jobs: JobEntry[];
  onUpdate: (jobs: JobEntry) => void;
  onDelete: (jobId: string) => void;
};
export default function ListView({ jobs, onUpdate, onDelete }: ListViewProps) {
  return (
    <div className="h-screen overflow-y-auto md:pb-20 pb-40">
      {status.map((stat) => {
        const filteredJobs = jobs.filter((job) => job.status === stat.id);

        return (
          <Accordion key={stat.id} defaultValue={["to-apply"]}>
            <AccordionItem value={stat.id} className="py-1">
              <AccordionTrigger
                className={"cursor-pointer px-2  bg-primary text-secondary"}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold uppercase">{stat.type}</span>
                  <span className="pr-3 text-muted-foreground">
                    {filteredJobs.length}
                  </span>
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
                        <p>
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
