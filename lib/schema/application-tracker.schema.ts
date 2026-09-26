import {z} from "zod";

export const jobEntrySchema = z.object({
    jobTitle: z.string().min(1, "A job title is required"),
    employmentType: z.enum(["full-time", "part-time", "contract", "contract-to-hire", "internship", "temporary", "freelance"]),
    companyName: z.string().min(1, "A company name is required"),
    companyWebsite: z.string().optional(),
    location: z.string().optional(),
    contact: z.string().optional(),
    jobDescription: z.string().min(1, "A job description is required"),
    jobQualifications: z.string().min(1, "Job qualifications are required"),
    status: z.enum(["to-apply", "applied", "interview", "offer", "closed"]),
    workSetup: z.enum(["onsite", "hybrid", "remote"]),
    currency: z.string().default("PHP"),
    salary: z.coerce.number().default(0),
    jobLink: z.string().optional(),
    resume: z.instanceof(File).optional(),
    benefits: z.string().optional(),
    additionalNotes: z.string().optional(),
appliedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).optional(),
interviewDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/).optional(),
});

export type JobEntryData = z.infer<typeof jobEntrySchema>;