import React from "react";
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

type EditJobEntryProps = {
  open: boolean;
  setOpen: (setOpen: boolean) => void;
  job: JobEntry;
  onJobUpdated: (job: JobEntry) => void;
};

export default function EditJobEntryDialog({
  open,
  setOpen,
  job,
  onJobUpdated,
}: EditJobEntryProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col md:border-2 border-foreground md:rounded-lg! rounded-none! md:min-w-250 md:max-h-160 lg:max-h-190 max-h-screen max-w-screen">
        <DialogHeader className="p-6 py-2">
          <DialogTitle className="font-bold uppercase text-lg">
            Edit Job Entry
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          {/**
           *  FormData for manually adding Job Entries
           */}
          <JobEntryForm
            job={job}
            onSuccess={() => setOpen(false)}
            onSubmit={onJobUpdated}
          />
        </div>
        <DialogFooter className="p-6 py-2">
          <Button
            type="submit"
            form="job-entry-form"
            className="cursor-pointer"
          >
           Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
