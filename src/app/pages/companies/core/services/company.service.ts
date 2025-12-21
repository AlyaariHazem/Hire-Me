import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'environments/environment.development';
import { ICompanyData } from '../models';

interface CompaniesListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: ICompanyData[];
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  createCompany(payload: Partial<ICompanyData> | FormData) {
    return this.http.post<ICompanyData>(
      environment.getUrl('create', 'companies'),
      payload
    );
  }

  // ✅ FIXED: extract results[]
  getMyCompanies() {
    return this.http
      .get<CompaniesListResponse>(
        environment.getUrl('my-companies', 'companies')
      )
      .pipe(map(res => res?.results ?? []));
  }

  getBySlug(slug: string) {
    return this.http.get<ICompanyData>(
      environment.getUrl(slug, 'companies')
    );
  }

  // Get all companies (public endpoint)
  getAllCompanies(params?: {
    search?: string;
    industry?: string;
    city?: string;
    size?: string;
    is_featured?: boolean;
    is_verified?: boolean;
    ordering?: string;
    page?: number;
    page_size?: number;
  }) {
    return this.http
      .get<CompaniesListResponse>(
        environment.getUrl('', 'companies'),
        { params: params as any }
      )
      .pipe(map(res => res ?? { count: 0, results: [], next: null, previous: null }));
  }

  updateCompany(slug: string, payload: Partial<ICompanyData> | FormData) {
    return this.http.put<ICompanyData>(
      environment.getUrl(`${slug}/update`, 'companies'),
      payload
    );
  }

  patchCompany(slug: string, payload: Partial<ICompanyData>) {
    return this.http.patch<ICompanyData>(
      environment.getUrl(`${slug}/update`, 'companies'),
      payload
    );
  }

  deleteCompany(slug: string) {
    return this.http.delete<void>(
      environment.getUrl(`${slug}/delete`, 'companies')
    );
  }

  getEmployerDashboardStats() {
    return this.http.get<EmployerDashboardStats>(
      environment.getUrl('employer-dashboard-stats', 'companies')
    );
  }
}

export interface EmployerDashboardStats {
  overview: {
    total_companies: number;
    total_jobs: number;
    active_jobs: number;
    total_applications: number;
    total_unique_applicants: number;
    total_views: number;
    total_messages: number;
    unread_messages: number;
  };
  charts: {
    apps_over_time: {
      labels: string[];
      series: number[];
    };
    jobs_by_city: {
      labels: string[];
      series: number[];
    };
    jobs_by_category: {
      labels: string[];
      series: number[];
    };
    jobs_by_type: {
      labels: string[];
      series: number[];
    };
    applications_by_status: {
      labels: string[];
      series: number[];
    };
    applicants_by_city: {
      labels: string[];
      series: number[];
    };
    applicants_by_category: {
      labels: string[];
      series: number[];
    };
    applicants_by_job_title: {
      labels: string[];
      series: number[];
    };
  };
}
