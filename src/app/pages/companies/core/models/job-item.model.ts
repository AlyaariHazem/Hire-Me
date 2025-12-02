// job-item.model.ts

export interface JobItem {
  id: number;
  title: string;
  slug: string;
  job_type: string;
  experience_level: string;
  city: string;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_negotiable: boolean;
  is_bookmarked?: boolean;
  is_featured?: boolean;
  is_urgent?: boolean;
  is_applied?: boolean;
  is_active?: boolean;
  views_count?: number;
  applications_count?: number;
  application_deadline?: string | null;
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

  // English: optional short description if backend ever sends it
  description?: string | null;
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
  is_bookmarked?: boolean;
  is_salary_negotiable?: boolean;
  is_active?: boolean;


  // English: backend may return object or id
  company: JobItem['company'] | number;
  category: JobItem['category'] | number;
};
