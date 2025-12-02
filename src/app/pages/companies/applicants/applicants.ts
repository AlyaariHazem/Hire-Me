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
        this.applications = res.results || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.toastr.error('فشل في تحميل المتقدمين');
        this.loading = false;
      }
    });
  }

  get filteredApplications(): Application[] {
    if (this.statusFilter === 'all') {
      return this.applications;
    }
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

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'قيد الانتظار',
      'reviewed': 'تم المراجعة',
      'accepted': 'مقبول',
      'rejected': 'مرفوض'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getApplicantName(app: Application): string {
    if (app.applicant?.user) {
      const firstName = app.applicant.user.first_name || '';
      const lastName = app.applicant.user.last_name || '';
      return `${firstName} ${lastName}`.trim() || 'مقدم طلب غير معروف';
    }
    return 'مقدم طلب غير معروف';
  }

  getApplicantInitials(app: Application): string {
    const name = this.getApplicantName(app);
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase() || '?';
  }

  getSkillsList(skills: string | undefined): string[] {
    if (!skills) return [];
    // Split by comma, semicolon, or newline
    return skills.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0);
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
    if (application.applicant?.resume) {
      window.open(application.applicant.resume, '_blank');
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

