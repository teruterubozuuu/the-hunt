CREATE TABLE activity_feed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    job_entry_id UUID NOT NULL,
    activity TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    CONSTRAINT fk_user 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_job_entry_id 
        FOREIGN KEY (job_entry_id) 
        REFERENCES job_entries(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_activity_feed_user_created
ON activity_feed (user_id, created_at DESC);

CREATE INDEX idx_activity_feed_job_entry
ON activity_feed (job_entry_id);