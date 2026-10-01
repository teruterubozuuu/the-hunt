import ApplicationTrackerPage from "@/components/pages/application-tracker/application-tracker-page";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const INITIAL_LIMIT = 10;
const JOB_STATUSES = ["to-apply", "applied", "interview", "offer", "closed"] as const;

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
  const results = await Promise.all(
    JOB_STATUSES.map((status) =>
      supabase
        .from("job_entries")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .eq("status", status)
        .order("created_at", { ascending: false })
        .range(0, INITIAL_LIMIT - 1),
    ),
  );
  const jobEntryError = results.find((result) => result.error)?.error;
  const jobEntry = results.flatMap((result) => result.data ?? []);
  const totalByStatus = Object.fromEntries(
    JOB_STATUSES.map((status, index) => [status, results[index].count ?? 0]),
  );

  if (jobEntryError) {
    console.error("Failed to fetch job entries", jobEntryError);
    return;
  }

  return (
    <ApplicationTrackerPage
      jobs={jobEntry}
      initialTotalByStatus={totalByStatus}
      initialJobId={jobId}
    />
  );
}
