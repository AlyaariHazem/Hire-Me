// review.model.ts

export interface CompanyReview {
  id: number;
  rating: number; // 1-5
  title: string;
  review_text: string;
  pros: string | null;
  cons: string | null;
  is_current_employee: boolean;
  job_title: string | null;
  reviewer: string; // reviewer ID or username
  reviewer_name: string;
  created_at: string;
}

export interface CreateReviewPayload {
  rating: number; // 1-5
  title: string;
  review_text: string;
  pros?: string | null;
  cons?: string | null;
  is_current_employee?: boolean;
  job_title?: string | null;
}

export interface ReviewsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompanyReview[];
}

