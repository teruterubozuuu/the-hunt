import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type InterviewJob = {
  id: string;
  job_title: string;
  company_name: string;
  interview_at?: string;
};

export default function InterviewSchedule({ jobs }: { jobs: InterviewJob[] }) {
  const sortedJobs = [...jobs].sort(
    (first, second) =>
      new Date(first.interview_at ?? 0).getTime() -
      new Date(second.interview_at ?? 0).getTime(),
  );

  return (
    <Card className="border-2 border-foreground flex-1">
      <CardHeader>
        <CardTitle>Interview Schedules</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-6 pt-0 overflow-y-auto">
        {sortedJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No interviews scheduled
          </p>
        ) : (
          sortedJobs.map((job) => (
            <div
              key={job.id}
              className="border border-foreground rounded-lg py-2"
            >
              <p className="font-semibold">{job.job_title}</p>
              <p className="text-sm text-muted-foreground">
                {job.company_name}
              </p>
              <time dateTime={job.interview_at} className="text-sm">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(job.interview_at ?? 0))}
              </time>
            </div>
          ))
        )}
      </CardContent>   
    </Card>
  );
}
