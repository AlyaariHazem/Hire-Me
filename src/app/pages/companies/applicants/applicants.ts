import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService, Application } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';

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

  applications: Application[] = [];
  loading = false;
  jobSlug: string | null = null;
  jobTitle: string = '';
  jobId: number | null = null;

  // Filter states
  statusFilter: 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected' = 'all';

  ngOnInit(): void {
    // Get job slug from query params
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
    
    // First, get the job details to get the job ID and title
    this.jobService.getJobBySlug(slug).subscribe({
      next: (job: any) => {
        this.jobId = job.id;
        this.jobTitle = job.title || 'غير محدد';
        
        // Then load applications for this job
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
    // API expects job ID (integer), not slug
    this.applicationService.getJobApplications(this.jobId).subscribe({
      next: (res) => {
        console.log('Applications response:', res);
        this.applications = res.results || [];
        console.log('Applications array:', this.applications);
        console.log('Applications array length:', this.applications.length);
        if (this.applications.length > 0) {
          console.log('First application:', this.applications[0]);
          console.log('First application has applicant?', !!this.applications[0].applicant);
        }
        this.loading = false;
        // Log after loading is set to false
        setTimeout(() => {
          console.log('Filtered applications count:', this.filteredApplications.length);
          console.log('Filtered applications:', this.filteredApplications);
        }, 100);
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.toastr.error('فشل في تحميل المتقدمين');
        this.loading = false;
      }
    });
  }

  get filteredApplications(): Application[] {
    // Return empty array if no applications
    if (!this.applications || this.applications.length === 0) {
      return [];
    }
    
    // If filter is 'all', return all applications
    if (this.statusFilter === 'all') {
      return [...this.applications]; // Return a copy to ensure change detection
    }
    
    // Otherwise, filter by status
    return this.applications.filter(app => app.status === this.statusFilter);
  }

  get statusCounts() {
    return {
      all: this.applications.length,
      pending: this.applications.filter(a => a.status === 'pending').length,
      reviewed: this.applications.filter(a => a.status === 'reviewed').length,
      accepted: this.applications.filter(a => a.status === 'accepted').length,
      rejected: this.applications.filter(a => a.status === 'rejected').length,
    };
  }

  setStatusFilter(status: 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'): void {
    this.statusFilter = status;
  }

  getStatusLabel(app: Application): string {
    // Use status_display from API if available, otherwise fallback to mapping
    if (app.status_display) {
      return app.status_display;
    }
    const labels: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'reviewed': 'تم المراجعة',
      'accepted': 'مقبول',
      'rejected': 'مرفوض'
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
    // Navigate to application details or open modal
    console.log('View application', application);
    // TODO: Implement view application details - could navigate to a detail page or open a modal
    this.toastr.info('عرض تفاصيل الطلب - سيتم تنفيذ هذه الميزة قريباً');
  }

  downloadResume(application: Application): void {
    if (application.resume) {
      window.open(application.resume, '_blank');
    } else {
      this.toastr.warning('لا يوجد سيرة ذاتية متاحة');
    }
  }

  updateApplicationStatus(applicationId: number, newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected'): void {
    // TODO: Implement API call to update application status
    // This would use PUT /api/applications/{id}/update/ with { status: newStatus }
    console.log('Update application status', applicationId, newStatus);
    this.toastr.info('تحديث حالة الطلب - سيتم تنفيذ هذه الميزة قريباً');
  }
}

