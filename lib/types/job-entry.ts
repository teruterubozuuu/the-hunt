export type JobEntry = {
  id: string;
  user_id: string;
  job_title: string;
  employment_type: "full-time" | "part-time" | "contract" | "contract-to-hire" | "internship" | "temporary" | "freelance";
  company_name: string;
  contact: string;
  job_description: string;
  job_qualifications: string;
  status: "to-apply" | "applied" | "interview" | "offer" | "closed";
  work_setup: "onsite" | "hybrid" | "remote";
  currency: string;
  salary: string;
  job_link: string;
  resume?: string; // a URL, not File
  benefits?: string;
  notes?: string;
  applied_at?: string;
  created_at?: string;
};