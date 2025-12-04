import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  size: string | null;
  industry: string | null;
  founded_year: number | null;
  employees_count: number | null;
  is_verified: boolean;
  is_featured: boolean;
  total_jobs: number;
  active_jobs: number;
  is_following: boolean;
  followers_count: number;
  average_rating: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  constructor(private http: HttpClient) {}

  getCompanyBySlug(slug: string): Observable<Company> {
    // Endpoint assumption based on pattern: /api/companies/{slug}/
    // or maybe /api/public/companies/{slug}/ ? 
    // job.service.ts uses environment.getUrl(slug, 'jobs') -> /api/jobs/{slug}
    // So likely environment.getUrl(slug, 'companies') -> /api/companies/{slug}
    const url = environment.getUrl(slug, 'companies');
    return this.http.get<Company>(url);
  }

  // Follow a company
  followCompany(companyId: number): Observable<any> {
    const url = environment.getUrl(`${companyId}/follow`, 'companies');
    return this.http.post(url, {});
  }

  // Unfollow a company (delete the follow relationship)
  unfollowCompany(companyId: number): Observable<any> {
    const url = environment.getUrl(`${companyId}/follow`, 'companies');
    return this.http.delete(url);
  }

  // Get jobs for a specific company
  getCompanyJobs(companyId: number): Observable<any> {
    const url = environment.getUrl(`${companyId}/jobs`, 'companies');
    return this.http.get<any>(url);
  }
}
