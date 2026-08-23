"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LinkIcon, CircleDashedIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import JobEntryForm from "./job-entry-form";
import { JobEntry } from "@/lib/types/job-entry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onJobCreated: (job: JobEntry) => void;
};

export default function AddJobEntryFromURL({ onJobCreated }: Props) {
  const [siteUrl, setSiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [siteData, setSiteData] = useState<JobEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const LOADING_MESSAGES = [
    "Fetching the page...",
    "Reading the job description...",
    "Extracting the details...",
    "Almost there...",
  ];

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) =>
        Math.min(i + 1, LOADING_MESSAGES.length - 1),
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAddEntry = async () => {
    if (!siteUrl) {
      toast.error("Please enter a URL");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/application-tracker/scraper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        console.error(result);
        toast.error(result.message || "Failed to extract job data");
        return;
      }

      setSiteData(result.data);
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSiteUrl("");
      setSiteData(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="bg-primary p-2 text-primary-foreground rounded-md cursor-pointer hover:opacity-90" title="Auto-fill">
        <LinkIcon weight="bold" size={13} />
      </DialogTrigger>

      <DialogContent
        className={cn(
          "flex flex-col md:border-2 border-foreground md:rounded-lg! rounded-none!",
          siteData
            ? "md:min-w-250 md:max-h-160 lg:max-h-190 max-h-screen max-w-screen"
            : "",
        )}
      >
        {" "}
        <DialogHeader>
          <DialogTitle>Enter Job Link</DialogTitle>
          <DialogDescription>
            Paste a job URL to auto-fill details
          </DialogDescription>
        </DialogHeader>
        {/* INPUT AREA */}
        <div className="flex gap-2">
          <Input
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.currentTarget.value)}
            placeholder="https://..."
          />

          <Button
            onClick={handleAddEntry}
            disabled={isLoading}
            className="px-4 py-2 bg-black text-white rounded-md cursor-pointer"
          >
            {isLoading ? (
              <CircleDashedIcon className="animate-spin" />
            ) : (
              "Fetch"
            )}
          </Button>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground animate-pulse text-center py-3">
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
        )}


        {!isLoading && siteData && (
          <div className="overflow-y-auto pr-2">
            <JobEntryForm
              siteData={siteData ?? undefined}
              onSubmit={onJobCreated}
              onSuccess={() => {
                setOpen(false);
                setSiteUrl("");
                setSiteData(null);
              }}
            />
          </div>
        )}
        {!isLoading && siteData && (
          <DialogFooter>
            <Button type="submit" form="job-entry-form">Add Entry</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
