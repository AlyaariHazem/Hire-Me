import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface JobFormQuestion {
  id?: number;
  label: string;
  help_text?: string | null;
  question_type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date' | 'number';
  required: boolean;
  options?: string | null; // Comma-separated options for select/radio/checkbox
  order: number;
}

export interface JobForm {
  id: number;
  company: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  questions: JobFormQuestion[];
  questions_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface JobFormListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: JobForm[];
}

export interface CreateJobFormDto {
  company: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
  questions: Omit<JobFormQuestion, 'id'>[];
}

export interface UpdateJobFormDto extends Partial<CreateJobFormDto> {}

export interface JobFormFilters {
  company?: number;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

@Injectable({ providedIn: 'root' })
export class JobFormService {
  constructor(private http: HttpClient) {}

  // Get list of job forms
  getJobForms(filters?: JobFormFilters): Observable<JobFormListResponse> {
    const url = environment.getUrl('forms', 'job-forms');
    
    let httpParams = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<JobFormListResponse>(url, { params: httpParams });
  }

  // Get single job form by ID
  getJobFormById(id: number): Observable<JobForm> {
    const url = `${environment.getUrl('forms', 'job-forms')}${id}/`;
    return this.http.get<JobForm>(url);
  }

  // Create new job form
  createJobForm(data: CreateJobFormDto): Observable<JobForm> {
    const url = environment.getUrl('forms', 'job-forms');
    return this.http.post<JobForm>(url, data);
  }

  // Update job form
  updateJobForm(id: number, data: UpdateJobFormDto): Observable<JobForm> {
    const url = `${environment.getUrl('forms', 'job-forms')}${id}/`;
    return this.http.put<JobForm>(url, data);
  }

  // Partial update job form
  partialUpdateJobForm(id: number, data: Partial<UpdateJobFormDto>): Observable<JobForm> {
    const url = `${environment.getUrl('forms', 'job-forms')}${id}/`;
    return this.http.patch<JobForm>(url, data);
  }

  // Delete job form
  deleteJobForm(id: number): Observable<void> {
    const url = `${environment.getUrl('forms', 'job-forms')}${id}/`;
    return this.http.delete<void>(url);
  }
}

