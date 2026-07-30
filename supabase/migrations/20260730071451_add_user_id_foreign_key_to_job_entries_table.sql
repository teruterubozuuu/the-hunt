ALTER TABLE job_entries
ADD COLUMN user_id uuid;

ALTER TABLE job_entries
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;