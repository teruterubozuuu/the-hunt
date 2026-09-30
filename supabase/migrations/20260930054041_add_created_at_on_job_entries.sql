ALTER TABLE job_entries
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

UPDATE job_entries
SET created_at = applied_at
WHERE applied_at IS NOT NULL;