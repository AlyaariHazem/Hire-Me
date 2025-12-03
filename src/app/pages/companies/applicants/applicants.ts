import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService, Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

@Component({
  selector: 'app-all-applicants',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './applicants.html',
  styleUrls: ['./applicants.scss']
})
export class Applicants implements OnInit {
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private toastr = inject(ToastrService);

  applications: Application[] = [];
  filteredApplications: Application[] = [];

  loading = false;
  statusFilter: StatusFilter = 'all';
  jobFilter: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalCount = 0;
  hasNext = false;
  hasPrevious = false;
  totalPages = 0;

  // Get unique jobs from applications
  get uniqueJobs(): Array<{ id: number; title: string }> {
    const jobsMap = new Map<number, string>();
    this.applications.forEach(app => {
      if (app.job && !jobsMap.has(app.job.id)) {
        jobsMap.set(app.job.id, app.job.title);
      }
    });
    return Array.from(jobsMap.entries()).map(([id, title]) => ({ id, title }));
  }

  statusCounts = {
    all: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0
  };

  // Modal state
  showDetailsModal = false;
  selectedApplication: Application | null = null;
  loadingDetails = false;

  ngOnInit(): void {
    this.loadAllApplications();
  }

  loadAllApplications(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    const params: any = {
      ordering: '-applied_at',
      page: page,
      page_size: this.pageSize
    };

    // Add job filter if selected
    if (this.jobFilter) {
      params.job = this.jobFilter;
    }

    // Add status filter if not 'all'
    if (this.statusFilter !== 'all') {
      params.status = this.statusFilter;
    }

    this.applicationService.getAllJobApplications(params).subscribe({
      next: (response) => {
        this.applications = response.results || [];
        this.totalCount = response.count || 0;
        this.hasNext = !!response.next;
        this.hasPrevious = !!response.previous;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        
        // No need to filter client-side since API handles it
        this.filteredApplications = [...this.applications];
        this.updateStatusCounts();
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
    // Counts are for current page only
    // For accurate totals, we'd need separate API calls per status
    const apps = this.applications;

    this.statusCounts = {
      all: this.totalCount, // Use total from API
      pending: apps.filter(a => a.status === 'pending').length,
      reviewed: apps.filter(a => a.status === 'reviewed').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    };
  }

  // Note: Filtering is now done server-side via API parameters
  // This method is kept for compatibility but filtering happens in loadAllApplications
  private applyFilters(): void {
    // Since filtering is done server-side, just copy applications
    this.filteredApplications = [...this.applications];
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter = status;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadAllApplications(1);
  }

  setJobFilter(jobId: number | null): void {
    this.jobFilter = jobId;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadAllApplications(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAllApplications(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.hasNext) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Expose Math to template
  Math = Math;

  getStatusLabel(app: Application): string {
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

  formatDate(dateStr: string | null | undefined): string {
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

  getJobTypeLabel(jobType: string): string {
    const labels: Record<string, string> = {
      full_time: 'دوام كامل',
      part_time: 'دوام جزئي',
      contract: 'عقد',
      freelance: 'عمل حر',
      internship: 'تدريب'
    };
    return labels[jobType] || jobType;
  }

  getExperienceLevelLabel(level: string): string {
    const labels: Record<string, string> = {
      entry: 'مبتدئ',
      junior: 'مبتدئ',
      mid: 'متوسط',
      senior: 'خبير',
      executive: 'تنفيذي'
    };
    return labels[level] || level;
  }

  formatSalaryRange(min: number | null, max: number | null, negotiable: boolean): string {
    if (negotiable) {
      return 'قابل للتفاوض';
    }
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ريال`;
    }
    if (min) {
      return `من ${min.toLocaleString()} ريال`;
    }
    if (max) {
      return `حتى ${max.toLocaleString()} ريال`;
    }
    return 'غير محدد';
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    return date.toLocaleString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    this.selectedApplication = application;
    this.showDetailsModal = true;
    this.loadingDetails = true;

    this.applicationService.getApplicationById(application.id).subscribe({
      next: (fullApplication) => {
        this.selectedApplication = fullApplication;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Failed to load application details', err);
        this.toastr.error('فشل في تحميل تفاصيل الطلب');
        this.loadingDetails = false;
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedApplication = null;
    this.loadingDetails = false;
  }

  downloadResume(application: Application): void {
    if (application.resume) {
      window.open(application.resume, '_blank');
    } else {
      this.toastr.warning('لا يوجد سيرة ذاتية متاحة');
    }
  }

  viewJobApplicants(jobId: number, jobSlug: string): void {
    this.router.navigate(['/companies/applicants-for-job'], {
      queryParams: { job: jobSlug }
    });
  }

  updateApplicationStatus(
    applicationId: number,
    newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): void {
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) {
      this.toastr.error('لم يتم العثور على الطلب');
      return;
    }

    const oldStatus = application.status;
    application.status = newStatus;

    const statusLabels: Record<string, string> = {
      pending: 'قيد المراجعة',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض'
    };
    application.status_display = statusLabels[newStatus] || newStatus;

    this.updateStatusCounts();
    this.applyFilters();

    this.applicationService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: (updatedApp) => {
        const index = this.applications.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          this.applications[index] = updatedApp;
        }

        // Reload current page to reflect changes
        this.loadAllApplications(this.currentPage);

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
        application.status = oldStatus;
        this.updateStatusCounts();
        this.applyFilters();
        this.toastr.error('فشل في تحديث حالة الطلب. يرجى المحاولة مرة أخرى');
      }
    });
  }
}

