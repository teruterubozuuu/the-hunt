import DashboardPage from "@/components/pages/dashboard/dashboard-page";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  // 1. Authorize user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // 2. Fetch data
  const { data, error } = await supabase
    .from("job_entries")
    .select("id, user_id, status, applied_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to fetch data", error);
    return;
  }

  return (
    <div className="overflow-y-auto">
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <p className="text-sm text-muted-foreground font-semibold">Track your job application analytics</p>
      <main className="pt-3">
        <DashboardPage data={data} />
      </main>
    </div>
  );
}
