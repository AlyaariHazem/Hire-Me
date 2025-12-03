import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    requirements?: string;
    company: {
      id: number;
      name: string;
      slug: string;
      logo: string | null;
      city?: string;
    };
    category?: {
      id: number;
      name: string;
    } | null;
    city: string | null;
    job_type?: string;
    experience_level?: string;
    salary_min?: number | null;
    salary_max?: number | null;
    is_salary_negotiable?: boolean;
    application_deadline?: string | null;
  };
  applicant?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone: string | null;
    date_of_birth: string | null;
    profile_picture: string | null;
    bio: string | null;
    location: string | null;
    is_verified: boolean;
    created_at: string;
  };
  cover_letter: string | null;
  resume: string | null;
  portfolio_url: string | null;
  expected_salary: number | null;
  availability_date: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  status_display: string; // Arabic display text
  notes: string | null;
  employer_notes: string | null;
  rating: number | null;
  is_viewed: boolean;
  viewed_at: string | null;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Application[];
}

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private http: HttpClient) {}

  getApplications(params?: any): Observable<ApplicationListResponse> {
    const url = environment.getUrl('', 'applications'); // /api/applications/
    
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<ApplicationListResponse>(url, { params: httpParams });
  }

  // Get applications for a specific job (for employers)
  // Based on Swagger: GET /api/applications/job-applications/ with query params
  // API expects job ID (integer) as query parameter
  getJobApplications(jobId: number, params?: any): Observable<ApplicationListResponse> {
    const url = environment.getUrl('job-applications', 'applications'); // /api/applications/job-applications/
    
    let httpParams = new HttpParams();
    // API expects job ID - try 'job' first, if that doesn't work, try 'job_id'
    httpParams = httpParams.set('job', String(jobId));
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<ApplicationListResponse>(url, { params: httpParams });
  }

  // Get my applications (for job seekers)
  getMyApplications(params?: any): Observable<ApplicationListResponse> {
    const url = environment.getUrl('my-applications', 'applications');
    
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<ApplicationListResponse>(url, { params: httpParams });
  }

  // Apply to a job
  applyToJob(jobId: number): Observable<any> {
    const url = environment.getUrl('apply', 'applications');
    return this.http.post(url, { job: jobId });
  }

  // Get application statistics
  getApplicationStatistics(): Observable<any> {
    const url = environment.getUrl('statistics', 'applications');
    return this.http.get(url);
  }

  // Get single application by ID
  getApplicationById(applicationId: number): Observable<Application> {
    const url = environment.getUrl(`${applicationId}`, 'applications'); // /api/applications/{id}/
    return this.http.get<Application>(url);
  }

  // Update application status (for employers)
  updateApplicationStatus(
    applicationId: number,
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): Observable<Application> {
    const url = environment.getUrl(`${applicationId}`, 'applications')+'update/'; // /api/applications/{id}/update/
    return this.http.patch<Application>(url, { status });
  }
}
