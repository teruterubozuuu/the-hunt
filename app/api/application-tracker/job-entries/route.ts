import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { JobEntry } from "@/lib/types/job-entry";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const VALID_STATUSES: JobEntry["status"][] = [
  "to-apply",
  "applied",
  "interview",
  "offer",
  "closed",
];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") as JobEntry["status"] | null;
  const search = searchParams.get("search")?.trim() ?? "";
  const offset = Math.max(Number(searchParams.get("offset")) || 0, 0);
  const requestedLimit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ message: "Invalid job status" }, { status: 400 });
  }

  let query = supabase
    .from("job_entries")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (search) {
    const searchTerm = search.replace(/[,%]/g, " ");
    if (!status.includes(searchTerm)) {
      query = query.or(
        `job_title.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,contact.ilike.%${searchTerm}%,company_location.ilike.%${searchTerm}%`,
      );
    }
  }

  const { data, count, error } = await query.range(
    offset,
    offset + limit - 1,
  );

  if (error) {
    console.error("Failed to fetch job entries", error);
    return NextResponse.json(
      { message: "Failed to fetch job entries" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    jobs: data ?? [],
    status,
    total: count ?? 0,
    hasMore: offset + (data?.length ?? 0) < (count ?? 0),
  });
}