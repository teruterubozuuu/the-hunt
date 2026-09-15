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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DragEndEvent } from "@dnd-kit/react";

type ApplicationTrackerProps = {
  jobs: JobEntry[];
};

type JobStatus = JobEntry["status"];

export default function ApplicationTrackerPage({
  jobs,
}: ApplicationTrackerProps) {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [items, setItems] = useState(jobs);

  const handleEntryDeleted = (jobId: string) => {
    setItems((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleEntryUpdated = (updatedJob: JobEntry) => {
    setItems((prev) =>
      prev.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
    );
  };

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

  // Force list whenever view is on mobile
  useEffect(() => {
    if (isMobile && view === "kanban") setView("list");
  }, [isMobile, view]);

  return (
    <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
      <div className="flex justify-between">
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

        {/* - - - Search Bar Desktop View - - - */}
        <div className="hidden md:block relative">
          <Input
            type="text"
            name="search"
            className="w-70! pl-7 bg-muted/80 border-2 border-foreground"
            placeholder="Search for a job entry..."
          />
          <MagnifyingGlassIcon className="absolute -translate-y-1/2 top-1/2 left-2" />
        </div>

        {/* - - - Search Bar Mobile View - - - */}
        <Dialog>
          <DialogTrigger className="md:hidden bg-primary px-2 py-1 rounded-md">
            <MagnifyingGlassIcon className="text-secondary" />
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>
            <Command className="max-w-sm rounded-md p-0!">
              <CommandInput placeholder="Search for a job entry..." />
              <CommandEmpty className="text-muted-foreground">
                No results found.
              </CommandEmpty>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
      <TabsContent value="kanban">
        <KanbanView
          jobs={jobs}
          onDelete={handleEntryDeleted}
          onUpdate={handleEntryUpdated}
          onDragEnd={handleDragEnd}
          items={items}
          setItems={setItems}
        />
      </TabsContent>
      <TabsContent value="list">
        <ListView
          jobs={jobs}
          onDelete={handleEntryDeleted}
          onUpdate={handleEntryUpdated}
          items={items}
          setItems={setItems}
        />
      </TabsContent>
    </Tabs>
  );
}
