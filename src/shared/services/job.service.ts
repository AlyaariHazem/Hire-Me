import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CreateJobDto, JobDetails, JobItem } from '@app/companies/models';
import { ExperienceLevel, JobCity, JobType } from '@app/companies/enums';

export interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
  }[];
}

// comments are in English only
export interface JobFilters {
  category?: number;
  city?: JobCity;
  company?: number;
  experience_level?: ExperienceLevel;
  job_type?: JobType;
  ordering?: string;
  page?: number;
  page_size?: number;
  search?: string;
}

export interface JobListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobItem[];
}
export interface JobAlert {
  id: number;
  title: string;
  keywords?: string;
  city?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  is_active: boolean;
  email_notifications: boolean;
  category?: number;
  created_at?: string;
  updated_at?: string;
}

export interface JobStatistics {
  total_jobs?: number;
  featured_jobs?: number;
  urgent_jobs?: number;
  jobs_by_city?: Array<{ city: string; count: number }>;
  jobs_by_type?: Array<{ job_type: string; count: number }>;
  // Keep these for backward compatibility, in case they're added later
  total_applications?: number;
  weekly_applications?: number;
  pending_applications?: number;
  new_pending?: number;
  interviews_count?: number;
  saved_jobs_count?: number;
  daily_saved?: number;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private http: HttpClient) {}

  // -------- Jobs CRUD --------

  createJob(body: CreateJobDto): Observable<JobItem> {
    const url = environment.getUrl('create', 'jobs'); // /api/jobs/create/
    return this.http.post<JobItem>(url, body);
  }

  createJobFormData(formData: FormData): Observable<JobItem> {
    const url = environment.getUrl('create', 'jobs'); // /api/jobs/create/
    return this.http.post<JobItem>(url, formData);
  }

  getJobs(filters: JobFilters = {}): Observable<JobListResponse> {
    const url = environment.getUrl('', 'jobs'); // /api/jobs/

    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<JobListResponse>(url, { params });
  }

  getRecommendedJobs(filters: JobFilters = {}): Observable<JobListResponse> {
    const url = environment.getUrl('recommended', 'jobs'); // /api/jobs/recommended/

    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    // Ensure token is included in headers
    const token = localStorage.getItem('access');
    
    // Create headers with Authorization if token exists
    const headers = token 
      ? new HttpHeaders({ 'Authorization': `Token ${token}` })
      : new HttpHeaders();

    return this.http.get<JobListResponse>(url, { 
      params,
      headers
    });
  }

  getJobBySlug(slug: string): Observable<any> {
  const url = environment.getUrl(slug, 'jobs');
  return this.http.get<JobDetails>(url);
}

  updateJob(slug: string, body: Partial<CreateJobDto>): Observable<JobItem> {
    const url = environment.getUrl(`${slug}/update`, 'jobs'); // /api/jobs/{slug}/update/
    return this.http.put<JobItem>(url, body);
  }

  updateJobFormData(slug: string, formData: FormData): Observable<JobItem> {
    const url = environment.getUrl(`${slug}/update`, 'jobs'); // /api/jobs/{slug}/update/
    return this.http.put<JobItem>(url, formData);
  }

  patchJob(slug: string, body: Partial<CreateJobDto>): Observable<JobItem> {
    const url = environment.getUrl(`${slug}/update`, 'jobs'); // PATCH /api/jobs/{slug}/update/
    return this.http.patch<JobItem>(url, body);
  }

  deleteJob(slug: string): Observable<void> {
    const url = environment.getUrl(`${slug}/delete`, 'jobs'); // /api/jobs/{slug}/delete/
    return this.http.delete<void>(url);
  }

  // -------- Similar jobs --------

  getSimilarJobs(jobId: number): Observable<JobItem[]> {
    const url = environment.getUrl(`${jobId}/similar`, 'jobs'); // /api/jobs/{job_id}/similar/
    return this.http.get<JobItem[]>(url);
  }

  // -------- Bookmarks --------

  bookmarkJob(jobId: number): Observable<any> {
    const url = environment.getUrl(`${jobId}/bookmark`, 'jobs'); // POST /api/jobs/{job_id}/bookmark/
    return this.http.post(url, {});
  }

  // if backend supports delete bookmark separate:
  unbookmarkJob(jobId: number): Observable<any> {
    const url = environment.getUrl(`${jobId}/bookmark`, 'jobs'); // DELETE /api/jobs/{job_id}/bookmark/
    return this.http.delete(url);
  }

  getBookmarkedJobs(filters: JobFilters = {}): Observable<JobListResponse> {
    const url = environment.getUrl('bookmarks', 'jobs'); // GET /api/jobs/bookmarks/
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<JobListResponse>(url, { params });
  }

  // -------- Categories --------

  getCategories(): Observable<CategoriesResponse> {
    const url = environment.getUrl('categories', 'jobs'); // /api/jobs/categories/
    return this.http.get<CategoriesResponse>(url);
  }

  // -------- My jobs (employer side) --------

  getMyJobs(filters: JobFilters = {}): Observable<JobListResponse> {
    const url = environment.getUrl('my-jobs', 'jobs'); // GET /api/jobs/my-jobs/
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<JobListResponse>(url, { params });
  }

  // -------- Statistics --------

  getJobStatistics(): Observable<JobStatistics> {
    const url = environment.getUrl('statistics', 'jobs'); // GET /api/jobs/statistics/
    return this.http.get<JobStatistics>(url);
  }

  // -------- Alerts --------

  getAlerts(): Observable<JobAlert[]> {
    const url = environment.getUrl('alerts', 'jobs'); // GET /api/jobs/alerts/
    return this.http.get<JobAlert[]>(url);
  }

  createAlert(body: any): Observable<JobAlert> {
    const url = environment.getUrl('alerts', 'jobs'); // POST /api/jobs/alerts/
    return this.http.post<JobAlert>(url, body);
  }

  getAlertById(id: number): Observable<JobAlert> {
    const url = environment.getUrl(`alerts/${id}`, 'jobs'); // GET /api/jobs/alerts/{id}/
    return this.http.get<JobAlert>(url);
  }

  updateAlert(id: number, body: any): Observable<JobAlert> {
    const url = environment.getUrl(`alerts/${id}`, 'jobs'); // PUT /api/jobs/alerts/{id}/
    return this.http.put<JobAlert>(url, body);
  }

  patchAlert(id: number, body: any): Observable<JobAlert> {
    const url = environment.getUrl(`alerts/${id}`, 'jobs'); // PATCH /api/jobs/alerts/{id}/
    return this.http.patch<JobAlert>(url, body);
  }

  deleteAlert(id: number): Observable<void> {
    const url = environment.getUrl(`alerts/${id}`, 'jobs'); // DELETE /api/jobs/alerts/{id}/
    return this.http.delete<void>(url);
  }
}
