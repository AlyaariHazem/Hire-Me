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