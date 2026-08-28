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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JobEntry } from "@/lib/types/job-entry";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

type ApplicationTrackerProps = {
  jobs: JobEntry[];
}

export default function ApplicationTrackerPage({jobs}: ApplicationTrackerProps) {
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

  // Force list whenever view is on mobile
  useEffect(()=>{
    if(isMobile && view === "kanban") setView("list");
  },[isMobile, view]);

  return (
    <Tabs value={view} onValueChange={(v)=> setView(v as "kanban" | "list")}>
      <div className="flex justify-between">
          <TabsList className="border-2 border-foreground">
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
            <MagnifyingGlassIcon className="text-secondary"/>
          </DialogTrigger>
          <DialogContent className="border-2 border-foreground">
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
            </DialogHeader>
            <Command className="max-w-sm rounded-md p-0!">
              <CommandInput placeholder="Search for a job entry..."/>
              <CommandEmpty className="text-muted-foreground">No results found.</CommandEmpty>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
      <TabsContent value="kanban">
        <KanbanView jobs={jobs} onDelete={handleEntryDeleted} onUpdate={handleEntryUpdated}/>
      </TabsContent>
      <TabsContent value="list">
        <ListView jobs={jobs} onDelete={handleEntryDeleted} onUpdate={handleEntryUpdated}/>
      </TabsContent>
    </Tabs>
  );
}
