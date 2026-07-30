import ApplicationTrackerPage from "@/components/pages/application-tracker/application-tracker-page";
import { JobEntry } from "@/lib/types/job-entry";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export default async function Tracker() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Get user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // 2. Fetch job entries
  const { data: jobEntry, error: jobEntryError } = await supabase
    .from("job_entries")
    .select("*")
    .eq("user_id", user.id);

  if (jobEntryError) {
    console.error("Failed to fetch job entries", jobEntryError);
    toast.error("Failed to fetch job entries");
  }

  return <ApplicationTrackerPage jobs={jobEntry ?? []} />;
}
