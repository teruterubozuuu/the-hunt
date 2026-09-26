import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { sendPushNotification } from "@/lib/push";

const REMINDERS = [
  { type: "24-hour", offsetMs: 24 * 60 * 60 * 1000, label: "tomorrow" },
  { type: "1-hour", offsetMs: 60 * 60 * 1000, label: "in 1 hour" },
] as const;

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = Date.now();
  let sent = 0;

  for (const reminder of REMINDERS) {
    const target = new Date(now + reminder.offsetMs);
    const lowerBound = new Date(target.getTime() - 10 * 60 * 1000).toISOString();
    const upperBound = new Date(target.getTime() + 10 * 60 * 1000).toISOString();

    const { data: jobs, error: jobsError } = await supabase
      .from("job_entries")
      .select("id, user_id, job_title, company_name, interview_at")
      .eq("status", "interview")
      .gte("interview_at", lowerBound)
      .lte("interview_at", upperBound);

    if (jobsError) throw jobsError;

    for (const job of jobs ?? []) {
      if (!job.interview_at) continue;

      const { data: reminderRecord, error: reminderError } = await supabase
        .from("interview_reminders")
        .insert({
          job_entry_id: job.id,
          reminder_type: reminder.type,
          interview_at: job.interview_at,
        })
        .select("id")
        .single();

      if (reminderError?.code === "23505") continue;
      if (reminderError) throw reminderError;

      const { data: subscriptions, error: subscriptionError } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", job.user_id);

      if (subscriptionError) throw subscriptionError;

      const payload = {
        title: "Upcoming interview",
        body: `${job.job_title} at ${job.company_name} is ${reminder.label}.`,
        url: `/application-tracker?jobId=${job.id}`,
      };

      try {
        await Promise.all(
          (subscriptions ?? []).map(async (subscription) => {
            try {
              await sendPushNotification(subscription, payload);
            } catch (error: unknown) {
              const statusCode =
                typeof error === "object" && error !== null && "statusCode" in error
                  ? error.statusCode
                  : undefined;

              if (statusCode === 404 || statusCode === 410) {
                await supabase
                  .from("push_subscriptions")
                  .delete()
                  .eq("endpoint", subscription.endpoint);
                return;
              }

              throw error;
            }
          }),
        );
        sent += 1;
      } catch (error) {
        await supabase
          .from("interview_reminders")
          .delete()
          .eq("id", reminderRecord.id);
        throw error;
      }
    }
  }

  return NextResponse.json({ success: true, sent });
}

export const GET = POST;
