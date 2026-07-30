CREATE TYPE employment_enum_type AS ENUM ('full-time', 'part-time', 'contract', 'contract-to-hire', 'internship', 'temporary', 'freelance');
CREATE TYPE status_enum AS ENUM ('to-apply', 'applied', 'interview', 'offer', 'closed');
CREATE TYPE work_setup_enum AS ENUM ('onsite', 'remote', 'hybrid');

CREATE TABLE job_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  employment_type employment_enum_type NOT NULL,
  company_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  job_description TEXT NOT NULL,
  job_qualifications TEXT NOT NULL,
  status status_enum NOT NULL,
  work_setup work_setup_enum NOT NULL,
  currency TEXT NOT NULL,
  salary INTEGER,
  job_link TEXT,
  resume TEXT --storage path or public URL to PDF
);
