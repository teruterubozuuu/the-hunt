"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteCard } from "@/hooks/use-delete-card";
import {
  DotsThreeOutlineIcon,
  NotePencilIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { toast } from "sonner";
import DeleteJobEntryAlertDialog from "./delete-job-entry-alert-dialog";
import EditJobEntryDialog from "./edit-job-entry-dialog";
import { JobEntry } from "@/lib/types/job-entry";

type CardDropdownMenuProps = {
  job: JobEntry;
  onDeleted: (jobId: string) => void;
  onUpdated: (job: JobEntry) => void;
};

export default function CardDropdownMenu({ job, onDeleted, onUpdated }: CardDropdownMenuProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {deleteCard} = useDeleteCard();

  const handleDelete = async() => {
    try{
      await deleteCard(job.id);
      toast.success("Successfully deleted card");
      setOpenDeleteDialog(false);
      onDeleted(job.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete card");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer hover:bg-muted-foreground/20 p-1 rounded-md">
          <DotsThreeOutlineIcon size={15} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={()=> setOpenEditDialog(true)}
          >
            <NotePencilIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenDeleteDialog(true)}
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteJobEntryAlertDialog open={openDeleteDialog} setOpen={setOpenDeleteDialog} handleDelete={handleDelete}/>
      <EditJobEntryDialog open={openEditDialog} setOpen={setOpenEditDialog} job={job} onJobUpdated={onUpdated}/>
    </>
  );
}
