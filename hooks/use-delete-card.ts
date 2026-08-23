import { toast } from "sonner";

/**
 * This function deletes a card in the database, it takes one argument which is the id of a card
 */
export function useDeleteCard() {
  const deleteCard = async (jobId: string) => {
    const res = await fetch("/api/application-tracker/delete-job-entry", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete job entry");
    }
  };

  return { deleteCard };
}
