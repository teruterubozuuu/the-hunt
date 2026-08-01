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

type CardDropdownMenuProps = {
  jobId: string;
  onDeleted: (jobId: string) => void;

};

export default function CardDropdownMenu({ jobId, onDeleted }: CardDropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const {deleteCard} = useDeleteCard();

  const handleDelete = async() => {
    try{
      await deleteCard(jobId);
      toast.success("Successfully deleted card");
      setOpen(false);
      onDeleted(jobId);
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
          <DropdownMenuItem className="cursor-pointer">
            <NotePencilIcon /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the card from your
              kanban.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
