// job-item.model.ts

export interface JobItem {
  id: number;
  title: string;
  slug: string;
  job_type: string;
  experience_level: string;
  city: string;
  salary_min: number;
  salary_max: number;
  is_salary_negotiable: boolean;
  created_at: string;
  company: {
    id: number;
    name: string;
    logo: string | null;
    city: string;
  };
  category: {
    id: number;
    name: string;
  };
}


export type JobDetails = Omit<JobItem, 'company' | 'category'> & {
  description?: string;
  requirements?: string;
  responsibilities?: string | null;
  benefits?: string | null;
  skills?: string | null;
  education_level?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  application_deadline?: string | null; // ISO
  is_featured?: boolean;
  is_urgent?: boolean;

  // English: backend may return object or id
  company: JobItem['company'] | number;
  category: JobItem['category'] | number;
};
