import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Application } from 'shared/services/application.service';
import { JobItem } from '../core/models/job-item.model';
import { ToastrService } from 'ngx-toastr';
import { OverviewStoreService } from '../services/overview.store';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private store = inject(OverviewStoreService);

  // Signals from store
  recentApplications = this.store.recentApplications;
  recentJobs = this.store.recentJobs;
  loadingApplications = this.store.loadingApplications;
  loadingJobs = this.store.loadingJobs;
  
  // Stats from store
  activeJobsThisMonth = this.store.activeJobsThisMonth;
  totalApplicantsThisWeek = this.store.totalApplicantsThisWeek;
  newApplicantsToday = this.store.newApplicantsToday;
  totalJobViews = this.store.totalJobViews;
  jobViewsThisWeek = this.store.jobViewsThisWeek;

  ngOnInit(): void {
    this.store.init();
  }

  // loadRecentApplications removed - handled by store

  getApplicantName(app: Application): string {
    if (app.applicant) {
      const firstName = app.applicant.first_name || '';
      const lastName = app.applicant.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || app.applicant.email || app.applicant.username || 'مقدم طلب غير معروف';
    }
    return 'مقدم طلب غير معروف';
  }

  getApplicantInitials(app: Application): string {
    if (app.applicant) {
      const firstName = app.applicant.first_name || '';
      const lastName = app.applicant.last_name || '';
      if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      }
      if (firstName) {
        return firstName.charAt(0).toUpperCase();
      }
      if (app.applicant.email) {
        return app.applicant.email.charAt(0).toUpperCase();
      }
    }
    return '?';
  }

  getApplicantTitle(app: Application): string {
    // You can extract this from applicant profile or use a default
    return app.job?.title || 'مرشح';
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'أمس';
    }
    if (diffInDays < 7) {
      return `منذ ${diffInDays} ${diffInDays === 2 ? 'يومين' : 'أيام'}`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? 'شهر' : 'أشهر'}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'جديد',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  viewApplicantProfile(app: Application): void {
    // Navigate to applicants page with job filter
    if (app.job?.slug) {
      this.router.navigate(['/companies/applicants'], {
        queryParams: { job: app.job.slug }
      });
    } else {
      this.toastr.info('عرض تفاصيل المتقدم - سيتم تنفيذ هذه الميزة قريباً');
    }
  }

  viewAllApplicants(): void {
    this.router.navigate(['/companies/applicants']);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const span = img.nextElementSibling as HTMLElement;
      if (span) {
        span.style.display = 'flex';
      }
    }
  }

  // loadRecentJobs removed - handled by store

  getTimeAgoForJob(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'الآن';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} ${diffInMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'أمس';
    }
    if (diffInDays < 7) {
      return `منذ ${diffInDays} ${diffInDays === 2 ? 'يومين' : 'أيام'}`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `منذ ${diffInWeeks} ${diffInWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    return `منذ ${diffInMonths} ${diffInMonths === 1 ? 'شهر' : 'أشهر'}`;
  }

  formatSalaryRange(job: JobItem): string {
    if (job.is_salary_negotiable) {
      return 'قابل للتفاوض';
    }
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ريال`;
    }
    if (job.salary_min) {
      return `من ${job.salary_min.toLocaleString()} ريال`;
    }
    if (job.salary_max) {
      return `حتى ${job.salary_max.toLocaleString()} ريال`;
    }
    return 'غير محدد';
  }

  getJobStatusLabel(job: JobItem): string {
    if (!job.is_active) {
      return 'متوقفة';
    }
    return 'نشطة';
  }

  getJobStatusClass(job: JobItem): string {
    if (!job.is_active) {
      return 'status-paused';
    }
    return 'status-active';
  }

  viewJobDetails(job: JobItem): void {
    if (job.slug) {
      this.router.navigate(['/companies/job-details'], {
        queryParams: { slug: job.slug }
      });
    }
  }

  viewAllJobs(): void {
    this.router.navigate(['/companies/manage-jobs']);
  }

  // Helper method to calculate jobs added this month
  getJobsAddedThisMonth(): number {
    const jobs = this.store.allJobs();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const thisMonthJobs = jobs.filter(job => {
      if (!job.is_active) return false;
      const created = new Date(job.created_at);
      return created >= startOfMonth;
    }).length;
    
    const lastMonthJobs = jobs.filter(job => {
      if (!job.is_active) return false;
      const created = new Date(job.created_at);
      return created >= lastMonthStart && created < startOfMonth;
    }).length;
    
    return thisMonthJobs - lastMonthJobs;
  }

  // Helper method to format views change
  getViewsChangeText(): string {
    const change = this.jobViewsThisWeek();
    if (change > 0) {
      return `+${change.toLocaleString()} هذا الأسبوع`;
    }
    return 'لا يوجد تغيير';
  }
}
