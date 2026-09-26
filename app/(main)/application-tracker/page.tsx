import ApplicationTrackerPage from "@/components/pages/application-tracker/application-tracker-page";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Tracker({searchParams}:{searchParams: Promise<{jobId?:string}>}) {
  const {jobId} = await searchParams;
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
    return;
  }

  return <ApplicationTrackerPage jobs={jobEntry} initialJobId={jobId}/>;
}
