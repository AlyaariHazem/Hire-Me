import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationService, Application } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { DocumentsService, Document, DocumentListResponse, DocumentType, VisibilityType } from 'app/pages/jobseeker/services/documents.service';
import { environment } from 'environments/environment';

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule, SharedModule, SkeletonModule, PaginatorModule],
  templateUrl: './applicants-for-job.html',
  styleUrls: ['./applicants-for-job.scss',
    '../applicants/applicants.scss'
  ]
})
export class ApplicantsForJob implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);
  private toastr = inject(ToastrService);
  private documentsService = inject(DocumentsService);
  private http = inject(HttpClient);

  applications: Application[] = [];          // all applications from API
  filteredApplications: Application[] = [];  // applications after status filter

  loading = false;
  jobSlug: string | null = null;
  jobTitle = '';
  jobId: number | null = null;

  statusFilter: StatusFilter = 'all';

  // Pagination
  currentPage = 1;
  page_size = 10;
  totalCount = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;

  statusCounts = {
    all: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0
  };
  
  // Store the total count for "all" tab (from initial load without status filter)
  totalCountAll = 0;

  // Modal state
  showDetailsModal = false;
  selectedApplication: Application | null = null;
  loadingDetails = false;
  
  // Documents state
  applicantDocuments = signal<Document[]>([]);
  loadingDocuments = signal<boolean>(false);

  // Expose Math to template
  Math = Math;

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

  private loadApplications(page: number = 1): void {
    if (!this.jobId) {
      console.error('Job ID is not available');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.currentPage = page;

    const params: any = {
      page: page,
      page_size: this.page_size
    };

    // Add status filter if not 'all'
    if (this.statusFilter !== 'all') {
      params.status = this.statusFilter;
    }

    this.applicationService.getJobApplications(this.jobId, params).subscribe({
      next: (res) => {
        console.log('Applications response:', res);

        // Store all applications
        this.applications = res.results || [];

        // Update pagination info
        this.totalCount = res.count || 0;
        this.totalPages = Math.ceil(this.totalCount / this.page_size);
        this.hasNext = !!res.next;
        this.hasPrevious = !!res.previous;

        // Update status counts from API if available
        if (res.status_counts) {
          // If loading without status filter (statusFilter === 'all'), store the total count
          if (this.statusFilter === 'all') {
            this.totalCountAll = res.count || 0;
          }
          
          this.statusCounts = {
            all: this.totalCountAll || res.count || 0, // Use stored total for "all"
            pending: res.status_counts.pending || 0,
            reviewed: res.status_counts.reviewed || 0,
            accepted: res.status_counts.accepted || 0,
            rejected: res.status_counts.rejected || 0
          };
        } else {
          // Fallback: calculate from current page results (not ideal but works)
          if (this.statusFilter === 'all') {
            this.totalCountAll = res.count || 0;
          }
          this.updateStatusCounts();
        }

        // Update filtered list (for status filter, we need to reload with status param)
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
    // Since we're using server-side filtering, the applications array already contains filtered results
    // Just assign them to filteredApplications for template compatibility
    this.filteredApplications = [...this.applications];
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter = status;
    // Reload applications with new status filter (reset to page 1)
    this.loadApplications(1);
  }

  onPageChange(event: any): void {
    // PrimeNG paginator uses 0-based page index, we use 1-based
    const newPage = event.page + 1;
    this.loadApplications(newPage);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    this.applicantDocuments.set([]);
    this.loadingDocuments.set(true);

    // Fetch full application details from API
    this.applicationService.getApplicationById(application.id).subscribe({
      next: (fullApplication) => {
        this.selectedApplication = fullApplication;
        this.loadingDetails = false;
        
        // Use documents from the application response if available
        if (fullApplication.documents && fullApplication.documents.length > 0) {
          // Filter to only show public and employers_only documents
          const visibleDocuments = fullApplication.documents
            .filter(doc => doc.visibility === 'public' || doc.visibility === 'employers_only')
            .map(doc => ({
              ...doc,
              document_type: doc.document_type as DocumentType,
              visibility: doc.visibility as VisibilityType
            })) as Document[];
          this.applicantDocuments.set(visibleDocuments);
          this.loadingDocuments.set(false);
        } else {
          // Fallback: Try to load documents via API if not included in response
          if (fullApplication.applicant?.id) {
            this.loadApplicantDocuments(fullApplication.applicant.id);
          } else {
            this.loadingDocuments.set(false);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load application details', err);
        this.toastr.error('فشل في تحميل تفاصيل الطلب');
        this.loadingDetails = false;
        this.loadingDocuments.set(false);
        // Keep the existing application data if API call fails
      }
    });
  }

  loadApplicantDocuments(applicantId: number): void {
    this.loadingDocuments.set(true);
    
    // Use the correct endpoint: /api/accounts/profile/documents/
    const url = environment.getUrl('profile/documents', 'accounts');
    
    // Try with user_id query parameter if the API supports it
    const params = new HttpParams().set('user_id', applicantId.toString());
    
    this.http.get<DocumentListResponse>(url, { params }).subscribe({
      next: (response) => {
        const documents = response.results || response.data || [];
        // Filter to only show public and employers_only documents
        const visibleDocuments = documents.filter(doc => 
          doc.visibility === 'public' || doc.visibility === 'employers_only'
        );
        this.applicantDocuments.set(visibleDocuments);
        this.loadingDocuments.set(false);
      },
      error: (err) => {
        console.warn('Failed to load documents with user_id param, trying without...', err);
        // Fallback: Try without user_id parameter (might return all accessible documents)
        this.http.get<DocumentListResponse>(url).subscribe({
          next: (response) => {
            const documents = response.results || response.data || [];
            // Filter to only show public and employers_only documents
            const visibleDocuments = documents.filter(doc => 
              doc.visibility === 'public' || doc.visibility === 'employers_only'
            );
            this.applicantDocuments.set(visibleDocuments);
            this.loadingDocuments.set(false);
          },
          error: (fallbackErr) => {
            console.error('Failed to load documents', fallbackErr);
            // If both fail, show empty
            this.applicantDocuments.set([]);
            this.loadingDocuments.set(false);
          }
        });
      }
    });
  }

  viewDocument(document: Document): void {
    // Log the document view
    this.documentsService.logDocumentView(document.id).subscribe({
      next: () => {
        // Open document in new tab
        const fileUrl = document.file_url || this.getDocumentUrl(document.file);
        if (fileUrl) {
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
      },
      error: (err) => {
        console.error('Failed to log document view', err);
        // Still open the document even if logging fails
        const fileUrl = document.file_url || this.getDocumentUrl(document.file);
        if (fileUrl) {
          window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
      }
    });
  }

  getDocumentUrl(filePath: string): string {
    if (!filePath) return '';
    if (/^(https?:|blob:|data:)/i.test(filePath)) return filePath;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(filePath).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  getDocumentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      certificate: 'شهادة أكاديمية',
      training: 'شهادة دورة تدريبية',
      project: 'مشروع',
      recommendation: 'خطاب توصية',
      award: 'جائزة أو تكريم',
      other: 'أخرى'
    };
    return labels[type] || type;
  }

  getDocumentIconClass(document: Document): string {
    const fileName = document.file_name?.toLowerCase() || '';
    
    if (fileName.endsWith('.pdf')) {
      return 'pi-file-pdf';
    }
    
    if (fileName.match(/\.(doc|docx)$/)) {
      return 'pi-file-word';
    }
    
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) {
      return 'pi-image';
    }
    
    return 'pi-file';
  }

  getQuestionById(questions: Array<{id: number; label: string; question_type: string; required: boolean; options?: string | null}>, questionId: number): {id: number; label: string; question_type: string; required: boolean; options?: string | null} | null {
    return questions.find(q => q.id === questionId) || null;
  }

  getQuestionLabel(questions: Array<{id: number; label: string; question_type: string; required: boolean; options?: string | null}>, questionId: number): string {
    const question = this.getQuestionById(questions, questionId);
    return question?.label || `سؤال رقم ${questionId}`;
  }

  getQuestionRequired(questions: Array<{id: number; label: string; question_type: string; required: boolean; options?: string | null}>, questionId: number): boolean {
    const question = this.getQuestionById(questions, questionId);
    return question?.required || false;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedApplication = null;
    this.loadingDetails = false;
    this.applicantDocuments.set([]);
    this.loadingDocuments.set(false);
  }

  downloadResume(application: Application): void {
    if (application.resume) {
      window.open(application.resume, '_blank');
    } else {
      this.toastr.warning('لا يوجد سيرة ذاتية متاحة');
    }
  }

  updatingStatus = new Set<number>(); // Track which applications are being updated

  confirmReject(applicationId: number): void {
    const application = this.applications.find(app => app.id === applicationId) || this.selectedApplication;
    if (!application) {
      this.toastr.error('لم يتم العثور على الطلب');
      return;
    }

    const applicantName = this.getApplicantName(application);
    const confirmed = confirm(`هل أنت متأكد من رفض طلب ${applicantName}؟\n\nهذا الإجراء لا يمكن التراجع عنه.`);
    
    if (confirmed) {
      this.updateApplicationStatus(applicationId, 'rejected');
      // Close modal if it's open
      if (this.showDetailsModal && this.selectedApplication?.id === applicationId) {
        this.closeDetailsModal();
      }
    }
  }

  updateApplicationStatus(
    applicationId: number,
    newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): void {
    // Prevent multiple clicks
    if (this.updatingStatus.has(applicationId)) {
      return;
    }

    // Find the application in the local array
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) {
      this.toastr.error('لم يتم العثور على الطلب');
      return;
    }

    this.updatingStatus.add(applicationId);

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

        // Reload applications to get updated counts and ensure consistency
        this.loadApplications(this.currentPage);

        // Show success message
        const statusMessages: Record<string, string> = {
          pending: 'تم تحديث حالة الطلب إلى قيد المراجعة',
          reviewed: 'تم تحديث حالة الطلب إلى تم المراجعة',
          accepted: 'تم قبول الطلب بنجاح',
          rejected: 'تم رفض الطلب'
        };
        this.toastr.success(statusMessages[newStatus] || 'تم تحديث حالة الطلب بنجاح');
        this.updatingStatus.delete(applicationId);
      },
      error: (err) => {
        // Revert optimistic update on error
        application.status = oldStatus;
        const statusLabels: Record<string, string> = {
          pending: 'قيد المراجعة',
          reviewed: 'تم المراجعة',
          accepted: 'مقبول',
          rejected: 'مرفوض'
        };
        application.status_display = statusLabels[oldStatus] || oldStatus;
        // Reload applications to get correct state
        this.loadApplications(this.currentPage);
        
        console.error('Failed to update application status', err);
        this.toastr.error('فشل في تحديث حالة الطلب. يرجى المحاولة مرة أخرى');
        this.updatingStatus.delete(applicationId);
      }
    });
  }
}

