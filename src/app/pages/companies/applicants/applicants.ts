import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService, Application } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './applicants.html',
  styleUrls: ['./applicants.scss']
})
export class Applicants implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);
  private toastr = inject(ToastrService);

  applications: Application[] = [];          // all applications from API
  filteredApplications: Application[] = [];  // applications after status filter

  loading = false;
  jobSlug: string | null = null;
  jobTitle = '';
  jobId: number | null = null;

  statusFilter: StatusFilter = 'all';

  statusCounts = {
    all: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const slug = params.get('job');
      if (slug) {
        this.jobSlug = slug;
        this.loadJobAndApplications(slug);
      } else {
        this.toastr.error('لم يتم تحديد الوظيفة');
        this.router.navigate(['/companies/manage-jobs']);
      }
    });
  }

  private loadJobAndApplications(slug: string): void {
    this.loading = true;

    this.jobService.getJobBySlug(slug).subscribe({
      next: (job: any) => {
        this.jobId = job.id;
        this.jobTitle = job.title || 'غير محدد';
        this.loadApplications();
      },
      error: (err) => {
        console.error('Failed to load job', err);
        this.toastr.error('فشل في تحميل بيانات الوظيفة');
        this.loading = false;
        this.router.navigate(['/companies/manage-jobs']);
      }
    });
  }

  private loadApplications(): void {
    if (!this.jobId) {
      console.error('Job ID is not available');
      this.loading = false;
      return;
    }

    this.loading = true;

    this.applicationService.getJobApplications(this.jobId).subscribe({
      next: (res) => {
        console.log('Applications response:', res);

        // Store all applications
        this.applications = res.results || [];

        // Update counts + filtered list
        this.updateStatusCounts();
        this.applyStatusFilter();

        console.log('Applications length:', this.applications.length);
        console.log('Filtered applications length:', this.filteredApplications.length);

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.toastr.error('فشل في تحميل المتقدمين');
        this.loading = false;
      }
    });
  }

  private updateStatusCounts(): void {
    const apps = this.applications;

    this.statusCounts = {
      all: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewed: apps.filter(a => a.status === 'reviewed').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    };
  }

  private applyStatusFilter(): void {
    // Return all applications if filter is 'all'
    if (this.statusFilter === 'all') {
      this.filteredApplications = [...this.applications];
      return;
    }

    // Filter by status
    this.filteredApplications = this.applications.filter(
      app => app.status === this.statusFilter
    );
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter = status;
    this.applyStatusFilter();
  }

  getStatusLabel(app: Application): string {
    // Prefer the display text from API
    if (app.status_display) {
      return app.status_display;
    }
    const labels: Record<string, string> = {
      pending: 'قيد الانتظار',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض'
    };
    return labels[app.status] || app.status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  getApplicantPhone(app: Application): string {
    return app.applicant?.phone || 'غير متوفر';
  }

  getApplicantLocation(app: Application): string {
    return app.applicant?.location || 'غير محدد';
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

  viewApplication(application: Application): void {
    console.log('View application', application);
    this.toastr.info('عرض تفاصيل الطلب - سيتم تنفيذ هذه الميزة قريباً');
  }

  downloadResume(application: Application): void {
    if (application.resume) {
      window.open(application.resume, '_blank');
    } else {
      this.toastr.warning('لا يوجد سيرة ذاتية متاحة');
    }
  }

  updateApplicationStatus(
    applicationId: number,
    newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): void {
    // Find the application in the local array
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) {
      this.toastr.error('لم يتم العثور على الطلب');
      return;
    }

    // Optimistic update: update UI immediately
    const oldStatus = application.status;
    application.status = newStatus;

    // Update status_display based on new status
    const statusLabels: Record<string, string> = {
      pending: 'قيد المراجعة',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض'
    };
    application.status_display = statusLabels[newStatus] || newStatus;

    // Update counts and filtered list
    this.updateStatusCounts();
    this.applyStatusFilter();

    // Call API to update status
    this.applicationService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: (updatedApp) => {
        // Update the application with the response from server
        const index = this.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          this.applications[index] = updatedApp;
        }

        // Refresh counts and filter
        this.updateStatusCounts();
        this.applyStatusFilter();

        // Show success message
        const statusMessages: Record<string, string> = {
          pending: 'تم تحديث حالة الطلب إلى قيد المراجعة',
          reviewed: 'تم تحديث حالة الطلب إلى تم المراجعة',
          accepted: 'تم قبول الطلب بنجاح',
          rejected: 'تم رفض الطلب'
        };
        this.toastr.success(statusMessages[newStatus] || 'تم تحديث حالة الطلب بنجاح');
      },
      error: (err) => {
        console.error('Failed to update application status', err);

        // Revert optimistic update
        application.status = oldStatus;
        this.updateStatusCounts();
        this.applyStatusFilter();

        // Show error message
        this.toastr.error('فشل في تحديث حالة الطلب. يرجى المحاولة مرة أخرى');
      }
    });
  }
}
