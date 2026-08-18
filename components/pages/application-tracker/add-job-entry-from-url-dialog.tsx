"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AddJobEntryFromURL() {
  const [siteUrl, setSiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleAddEntry = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/application-tracker/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteUrl }),
      });

      if (!res.ok) {
        toast.error("Failed to fetch URL");
        setIsLoading(false);
        return;
      }

      const result = await res.json();
      if (!result.success) {
        toast.error("Failed to extract job data");
        return;
      }

      setSiteData(result.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="bg-primary p-2 text-primary-foreground rounded-md cursor-pointer"
        title="Add Job Entry from URL"
      >
        <LinkIcon weight="bold" size={13} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Job Link</DialogTitle>
          <DialogDescription>
            Automatically enter job entry details by providing the job post's
            link
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          name="siteUrl"
          id="siteUrl"
          placeholder="Type the link here..."
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.currentTarget.value)}
        />
        {isLoading ? (
          <span>Loading...</span>
        ) : siteData ? (
          <div className="mt-2 text-sm">
            <p>{siteData.job_title}</p>
            <p>{siteData.job_description}</p>
          </div>
        ) : null}
        <Button className="cursor-pointer" onClick={handleAddEntry}>
          Add Entry
        </Button>
      </DialogContent>
    </Dialog>
  );
}
