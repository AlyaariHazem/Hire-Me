import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService, Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-overview',
  standalone: false,
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview implements OnInit {
  private applicationService = inject(ApplicationService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  recentApplications: Application[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadRecentApplications();
  }

  loadRecentApplications(): void {
    this.loading = true;
    // Get recent applications for all company jobs (last 4)
    this.applicationService.getAllJobApplications({ 
      ordering: '-applied_at',
      page_size: 4 
    }).subscribe({
      next: (response) => {
        this.recentApplications = response.results || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load recent applications', err);
        this.toastr.error('فشل في تحميل المتقدمين الجدد');
        this.loading = false;
      }
    });
  }

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
}
