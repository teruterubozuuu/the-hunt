import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const pageSize = 5;

  // 1. Authorize user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // 2. Fetch job entry data
  const { data, error } = await supabase
    .from("job_entries")
    .select(
      "id, user_id, job_title, company_name, status, applied_at, interview_at",
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Failed to fetch data", error);
    return;
  }

  // 3. Fetch activity data
  const { data: activityData, error: activityError } = await supabase
    .from("activity_feed")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, pageSize - 1);

  if (activityError) {
    console.error("Failed to fetch activity data", activityError);
    return;
  }

  return (
    <div className="overflow-y-auto">
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <p className="text-sm text-muted-foreground font-semibold">
        Track your job application analytics
      </p>
      <main className="pt-3">
        <DashboardPage data={data} activityData={activityData} />
      </main>
    </div>
  );
}
