"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "@phosphor-icons/react";
import JobEntryForm from "./job-entry-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JobEntry } from "@/lib/types/job-entry";

type AddJobEntryDialogProps = {
  defaultStatus?: string;
  onJobCreated: (job: JobEntry) => void;
}

export default function AddJobEntryDialog({defaultStatus, onJobCreated} : AddJobEntryDialogProps) {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 hover:bg-primary/5 text-secondary-foreground/40 font-semibold p-2 w-full rounded-md cursor-pointer text-xs">
        <PlusIcon weight="bold" /> Add a Job Entry
      </DialogTrigger>
      <DialogContent className="flex flex-col md:border-2 border-foreground md:rounded-lg! rounded-none! md:min-w-250 md:max-h-160 lg:max-h-190 max-h-screen max-w-screen">
        <DialogHeader className="p-6 py-2">
          <DialogTitle className="font-bold uppercase text-lg">Job Entry</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {/**
           *  FormData for manually adding Job Entries
           */}
          <JobEntryForm defaultStatus={defaultStatus} onSuccess={() => setOpen(false)} onJobCreated={onJobCreated}/>
        </div>
        <DialogFooter className="p-6 py-2">
          <Button type="submit" form="job-entry-form" className="cursor-pointer">Add Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
