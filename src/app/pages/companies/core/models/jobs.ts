import { JobCity } from '../enums';

export interface CreateJobDto {
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  skills?: string;
  company: number;            // backend expects numeric id
  category: number;           // backend expects numeric id
  job_type: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  experience_level: 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
  education_level?: 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'any';
  city: JobCity;
  salary_min?: number;
  salary_max?: number;
  is_salary_negotiable?: boolean;
  application_deadline?: string;  // ISO string
  contact_email?: string;
  contact_phone?: string;
  is_featured?: boolean;
  is_urgent?: boolean;
  is_active?: boolean; // For updating job status
}