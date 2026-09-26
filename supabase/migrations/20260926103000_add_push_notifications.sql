create table push_subscriptions (
    id uuid default gen_random_uuid() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    endpoint text not null unique,
    p256dh text not null,
    auth text not null,
    created_at timestamptz default now() not null
);

alter table push_subscriptions enable row level security;

create policy "Users can view their push subscriptions"
on push_subscriptions for select
using (auth.uid() = user_id);

create policy "Users can create their push subscriptions"
on push_subscriptions for insert
with check (auth.uid() = user_id);

create policy "Users can delete their push subscriptions"
on push_subscriptions for delete
using (auth.uid() = user_id);

create table interview_reminders (
    id uuid default gen_random_uuid() primary key,
    job_entry_id uuid not null references job_entries(id) on delete cascade,
    reminder_type text not null check (reminder_type in ('24-hour', '1-hour')),
    interview_at timestamptz not null,
    sent_at timestamptz default now() not null,
    unique (job_entry_id, reminder_type, interview_at)
);

alter table interview_reminders enable row level security;

create index idx_interview_reminders_job
on interview_reminders (job_entry_id);
