import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from 'shared/services/job.service';
import { SharedModule } from 'shared/shared-module';

interface Company {
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  jobs_count: number;
}

interface JobDetail {
  id: number;
  company: Company;
  category: Category;
  is_bookmarked: boolean;
  applications_count: number;
  is_applied: boolean;
  title: string;
  slug: string;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  skills: string | null;
  job_type: string;
  experience_level: string;
  education_level: string;
  city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_negotiable: boolean;
  application_deadline: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_urgent: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  posted_by: number;
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails implements OnInit {
  private jobService = inject(JobService);
  private activatedRoute = inject(ActivatedRoute);

  jobDetail: JobDetail | null = null;
  isLoading = false;
  showApplicationForm = false;

  ngOnInit(): void {
    const jobSlug = this.activatedRoute.snapshot.paramMap.get('slug'); // route param name = 'slug' in your example
    if (!jobSlug) {
      return;
    }

    this.isLoading = true;
    this.jobService.getJobBySlug(jobSlug).subscribe({
      next: (data: JobDetail) => {
        this.jobDetail = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load job details', err);
        this.isLoading = false;
      },
    });
  }

  toggleApplicationForm(): void {
    this.showApplicationForm = !this.showApplicationForm;
  }

  onApply(): void {
    // English: here you trigger your apply flow or navigate to apply page
    console.log('Apply clicked for job', this.jobDetail?.id);
  }

  onSaveJob(): void {
    // English: here you call backend to bookmark / unbookmark
    console.log('Save job', this.jobDetail?.id);
  }

  onShareJob(): void {
    // English: open share dialog, copy link, etc.
    if (!this.jobDetail) return;
    const url = window.location.href;
    navigator.clipboard?.writeText(url).catch(() => {});
    console.log('Share job', url);
  }

  getJobTypeLabel(type: string | null | undefined): string {
    switch (type) {
      case 'full_time':
        return 'دوام كامل';
      case 'part_time':
        return 'دوام جزئي';
      case 'remote':
        return 'عمل عن بُعد';
      case 'contract':
        return 'عقد مؤقت';
      default:
        return 'غير محدد';
    }
  }

  getExperienceLevelLabel(level: string | null | undefined): string {
    switch (level) {
      case 'junior':
        return 'مبتدئ';
      case 'mid':
      case 'mid_level':
        return 'متوسط';
      case 'senior':
        return 'خبير';
      default:
        return 'غير محدد';
    }
  }

  formatSalary(min: number | null, max: number | null): string {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ريال`;
    }
    if (min && !max) {
      return `ابتداءً من ${min.toLocaleString()} ريال`;
    }
    if (!min && max) {
      return `حتى ${max.toLocaleString()} ريال`;
    }
    return 'غير محدد';
  }
}
