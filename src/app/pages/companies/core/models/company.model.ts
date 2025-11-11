export interface ICompanyData {
  id?: number;
  slug?: string;
  name: string;
  description: string;
  logo: string;
  cover_image: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  size: string; 
  industry: string;
  founded_year: number | null;
  employees_count: number | null;
}
