import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    company: {
      name: string;
      logo: string | null;
    };
    city: string | null;
  };
  applicant?: {
    id: number;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      profile_picture?: string | null;
    };
    experience_level?: string;
    education_level?: string;
    skills?: string;
    resume?: string | null;
  };
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  message?: string;
  cover_letter?: string;
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
}
