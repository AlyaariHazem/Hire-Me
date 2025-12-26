import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

/**
 * Interview type enum
 */
export type InterviewType = 'phone' | 'video' | 'in_person' | 'technical' | 'hr' | 'final';

/**
 * Interview status enum
 */
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

/**
 * Interface for creating a new interview
 */
export interface CreateInterviewDto {
  application: number; // Application ID
  interview_type: InterviewType | string;
  scheduled_date: string; // ISO 8601 format
  duration_minutes?: number | null; // Optional, only required for video interviews
  location?: string | null;
  meeting_link?: string | null;
  interviewer_name: string;
  interviewer_email: string;
  notes?: string | null;
}

/**
 * Interface for updating an interview (partial update)
 */
export interface UpdateInterviewDto {
  interview_type?: InterviewType | string;
  scheduled_date?: string; // ISO 8601 format
  duration_minutes?: number | null;
  location?: string | null;
  meeting_link?: string | null;
  interviewer_name?: string;
  interviewer_email?: string;
  notes?: string | null;
  status?: InterviewStatus;
}

/**
 * Application reference in interview response
 */
export interface InterviewApplication {
  id: number;
  job: {
    id: number;
    title: string;
    slug: string;
    company: {
      id: number;
      name: string;
      slug: string;
    };
  };
  applicant?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    profile_picture: string | null;
  };
  status: string;
}

/**
 * Full interview interface (response from API)
 */
export interface Interview {
  id: number;
  application: number | InterviewApplication;
  interview_type: InterviewType | string;
  scheduled_date: string; // ISO 8601 format
  duration_minutes: number;
  location: string | null;
  meeting_link: string | null;
  interviewer_name: string;
  interviewer_email: string;
  notes: string | null;
  status?: InterviewStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Interview list response
 */
export interface InterviewListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Interview[];
}

/**
 * Service for managing interviews
 * Based on API endpoints:
 * - POST /api/applications/interviews/create/
 * - GET /api/applications/interviews/
 * - GET /api/applications/interviews/{id}/
 * - PUT /api/applications/interviews/{id}/
 * - PATCH /api/applications/interviews/{id}/
 */
@Injectable({ providedIn: 'root' })
export class InterviewService {
  constructor(private http: HttpClient) {}

  /**
   * Create a new interview
   * POST /api/applications/interviews/create/
   */
  createInterview(payload: CreateInterviewDto): Observable<Interview> {
    const url = environment.getUrl('interviews/create', 'applications');
    return this.http.post<Interview>(url, payload);
  }

  /**
   * Get all interviews with optional filters
   * GET /api/applications/interviews/
   */
  getInterviews(params?: {
    application?: number;
    interview_type?: InterviewType | string;
    status?: InterviewStatus;
    interviewer_email?: string;
    scheduled_date?: string;
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Observable<InterviewListResponse> {
    const url = environment.getUrl('interviews', 'applications');
    
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    return this.http.get<InterviewListResponse>(url, { params: httpParams });
  }

  /**
   * Get a single interview by ID
   * GET /api/applications/interviews/{id}/
   */
  getInterviewById(interviewId: number): Observable<Interview> {
    const url = environment.getUrl(`interviews/${interviewId}`, 'applications');
    return this.http.get<Interview>(url);
  }

  /**
   * Update an interview (full update)
   * PUT /api/applications/interviews/{id}/
   */
  updateInterview(interviewId: number, payload: CreateInterviewDto): Observable<Interview> {
    const url = environment.getUrl(`interviews/${interviewId}`, 'applications');
    return this.http.put<Interview>(url, payload);
  }

  /**
   * Partially update an interview
   * PATCH /api/applications/interviews/{id}/
   */
  patchInterview(interviewId: number, payload: UpdateInterviewDto): Observable<Interview> {
    const url = environment.getUrl(`interviews/${interviewId}`, 'applications');
    return this.http.patch<Interview>(url, payload);
  }

  /**
   * Get interviews for a specific application
   * Convenience method that filters by application ID
   */
  getInterviewsForApplication(applicationId: number): Observable<InterviewListResponse> {
    return this.getInterviews({ application: applicationId });
  }

  /**
   * Get upcoming interviews (scheduled status)
   * Convenience method
   */
  getUpcomingInterviews(params?: {
    application?: number;
    page?: number;
    page_size?: number;
  }): Observable<InterviewListResponse> {
    return this.getInterviews({
      ...params,
      status: 'scheduled',
      ordering: 'scheduled_date'
    });
  }
}

