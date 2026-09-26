"use client";
import KanbanView from "./kanban-view/kanban-view";
import ListView from "./list-view/list-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  KanbanIcon,
  ListDashesIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput } from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DragEndEvent } from "@dnd-kit/react";

type ApplicationTrackerProps = {
  jobs: JobEntry[];
  initialJobId?: string;
};

type JobStatus = JobEntry["status"];

type PendingInterview = {
  jobId: string;
};

export default function ApplicationTrackerPage({
  jobs,
  initialJobId,
}: ApplicationTrackerProps) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [items, setItems] = useState(jobs);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    initialJobId ?? null,
  );
  const [pendingInterview, setPendingInterview] =
    useState<PendingInterview | null>(null);
  const [interviewAt, setInterviewAt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Search Query logic
  const normalizedSearch = searchQuery.trim().toLowerCase(); // trims a query's white spaces and converts it to lower case
  const filteredItems = items.filter((job)=>{
    if (!normalizedSearch) return true;

    return [
      job.job_title,
      job.company_name,
      job.contact,
      job.company_location,
      job.employment_type,
      job.status
    ]
    .filter(Boolean)
    .some((value)=>
    value!.toLowerCase().includes(normalizedSearch)
  );
  })

  const handleSelectedJobChange = (jobId: string | null) => {
    setSelectedJobId(jobId);

    if (jobId === null) {
      router.replace(pathname, { scroll: false });
    }
  };

  const handleEntryDeleted = (jobId: string) => {
    setItems((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleEntryUpdated = (updatedJob: JobEntry) => {
    setItems((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    );
  };

  const persistStatus = async (
    jobId: string,
    newStatus: JobStatus,
    scheduledInterviewAt?: string,
  ) => {
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
          body: JSON.stringify({
            status: newStatus,
            interviewAt: scheduledInterviewAt,
          }),
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      if (data.jobStatus?.[0]) {
        setItems((prev) =>
          prev.map((j) => (j.id === jobId ? data.jobStatus[0] : j)),
        );
      }

      return true;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update job status");
      setItems(prevItems);
      return false;
    }
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    if (e.canceled) return;
    const { source, target } = e.operation;
    if (!target || !source) return;

    const jobId = String(source.id);
    const newStatus = target.id as JobStatus;
    const currentJob = items.find((job) => job.id === jobId);

    if (!currentJob || currentJob.status === newStatus) return;

    if (newStatus === "interview") {
      setPendingInterview({ jobId });
      setInterviewAt("");
      return;
    }

    await persistStatus(jobId, newStatus);
  };

  const handleInterviewScheduleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!pendingInterview || !interviewAt) {
      toast.error("Choose an interview date and time");
      return;
    }

    const saved = await persistStatus(
      pendingInterview.jobId,
      "interview",
      new Date(interviewAt).toISOString(),
    );

    if (saved) {
      setPendingInterview(null);
      setInterviewAt("");
    }
  };

  // Force list whenever view is on mobile
  useEffect(() => {
    if (isMobile && view === "kanban") setView("list");
  }, [isMobile, view]);

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
      <div className="flex justify-between gap-2">
        <TabsList
          className={!isMobile ? "border-2 border-foreground" : "hidden"}
        >
          <TabsTrigger value="kanban" className="hidden xl:flex cursor-pointer">
            <KanbanIcon /> Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="cursor-pointer">
            <ListDashesIcon /> List
          </TabsTrigger>
        </TabsList>

        {/* - - - Search Bar - - - */}
        <div className="relative md:w-70 w-full">
          <Input
            type="text"
            name="search"
            className="md:w-70! w-full pl-7 bg-muted/80 border-2 border-foreground"
            placeholder="Search for a job entry..."
            value={searchQuery}
            onChange={(event)=> setSearchQuery(event.target.value)}
          />
          <MagnifyingGlassIcon className="absolute -translate-y-1/2 top-1/2 left-2" />
        </div>

        
      </div>

      {/**
       * Interview Schedule Dialog
       */}
      <Dialog
        open={pendingInterview !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingInterview(null);
            setInterviewAt("");
          }
        }}
      >
        <DialogContent className="border-2 border-foreground">
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInterviewScheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interview-at">Interview date and time</Label>
              <Input
                id="interview-at"
                type="datetime-local"
                value={interviewAt}
                className="border-2 border-foreground cursor-pointer"
                onChange={(event) => setInterviewAt(event.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer">Save interview</Button>
          </form>
        </DialogContent>
      </Dialog>

      <TabsContent value="kanban">
        <KanbanView
          jobs={jobs}
          onDelete={handleEntryDeleted}
          onUpdate={handleEntryUpdated}
          onDragEnd={handleDragEnd}
          items={filteredItems}
          setItems={setItems}
          selectedJobId={selectedJobId}
          onSelectedJobChange={handleSelectedJobChange}
        />
      </TabsContent>
      <TabsContent value="list">
        <ListView
          jobs={jobs}
          onDelete={handleEntryDeleted}
          onUpdate={handleEntryUpdated}
          items={filteredItems}
          setItems={setItems}
          selectedJobId={selectedJobId}
          onSelectedJobChange={handleSelectedJobChange}
        />
      </TabsContent>
    </Tabs>
  );
}
