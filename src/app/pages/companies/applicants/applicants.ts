import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApplicationService, Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { DocumentsService, Document, DocumentListResponse, DocumentType, VisibilityType } from 'app/pages/jobseeker/services/documents.service';
import { environment } from 'environments/environment';

import { ApplicantsStoreService } from '../services/applicants.store';

type StatusFilter = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

@Component({
  selector: 'app-all-applicants',
  standalone: true,
  imports: [CommonModule, SharedModule, SkeletonModule, PaginatorModule],
  templateUrl: './applicants.html',
  styleUrls: ['./applicants.scss']
})
export class Applicants implements OnInit {
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private toastr = inject(ToastrService);
  private store = inject(ApplicantsStoreService);
  private documentsService = inject(DocumentsService);
  private http = inject(HttpClient);

  // Signals from store
  applications = this.store.applications;
  filteredApplications = this.store.applications; // For compatibility
  loading = this.store.loading;
  statusFilter = computed(() => this.store.filters().status as StatusFilter);
  jobFilter = computed(() => this.store.filters().jobId);
  currentPage = computed(() => this.store.filters().page);
  page_size = computed(() => this.store.filters().page_size);
  totalCount = this.store.totalCount;
  hasNext = this.store.hasNext;
  hasPrevious = this.store.hasPrevious;
  totalPages = this.store.totalPages;

  // Get status counts from store (from backend)
  statusCounts = computed(() => {
    const backendCounts = this.store.statusCounts();
    // Use totalCountAll for "الكل" tab, which is the total when status is 'all'
    // This ensures "الكل" always shows the correct total, not the filtered count
    return {
      all: this.store.totalCountAll(),
      pending: backendCounts.pending,
      reviewed: backendCounts.reviewed,
      accepted: backendCounts.accepted,
      rejected: backendCounts.rejected,
    };
  });

  // Computed properties
  uniqueJobs = computed(() => {
    const jobsMap = new Map<number, string>();
    this.applications().forEach(app => {
      if (app.job && !jobsMap.has(app.job.id)) {
        jobsMap.set(app.job.id, app.job.title);
      }
    });
    return Array.from(jobsMap.entries()).map(([id, title]) => ({ id, title }));
  });

  // Modal state
  showDetailsModal = false;
  selectedApplication: Application | null = null;
  loadingDetails = false;
  
  // Documents state
  applicantDocuments = signal<Document[]>([]);
  loadingDocuments = signal<boolean>(false);

  ngOnInit(): void {
    this.store.init();
  }

  // Helper for template compatibility since we removed loadAllApplications
  loadAllApplications(page: number = 1): void {
     this.store.setPage(page);
  }

  private updateStatusCounts(): void {
     // Handled by signal
  }

  private applyFilters(): void {
    // Handled by store
  }

  setStatusFilter(status: StatusFilter): void {
    this.store.setStatusFilter(status);
  }

  setJobFilter(jobId: number | null): void {
    this.store.setJobFilter(jobId);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.store.setPage(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.hasNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.hasPrevious()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage() - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages(), startPage + maxPagesToShow - 1);

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

  onPageChange(event: any): void {
    // PrimeNG paginator uses 0-based page index, we use 1-based
    const newPage = event.page + 1;
    this.goToPage(newPage);
  }

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

  getFilledTemplate(app: Application): string | null {
    return (app as any).filled_template || null;
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
      }
    });
  }

  loadApplicantDocuments(applicantId: number): void {
    this.loadingDocuments.set(true);
    
    // Use the correct endpoint: /api/accounts/profile/documents/
    // For employers viewing applicant documents, we may need to pass user_id as query parameter
    // or use a different endpoint structure
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

  getQuestionLabel(questions: Array<any>, questionId: number, response?: any): string {
    // Priority 1: Use question details from response if available
    if (response && response.question_details && response.question_details.label) {
      return response.question_details.label;
    }

    // Priority 2: Look up in questions array
    if (questions && questions.length > 0) {
      const question = questions.find(q => q.id === questionId);
      if (question && question.label) {
        return question.label;
      }
    }
    
    // Fallback
    return `سؤال رقم ${questionId}`;
  }

  getQuestionRequired(questions: Array<any>, questionId: number, response?: any): boolean {
    if (response && response.question_details) {
      return response.question_details.required;
    }
    const question = this.getQuestionById(questions, questionId);
    return question?.required || false;
  }

  // Helper to get custom form from application or job
  getCustomForm(application: Application): any {
    return application.custom_form || application.job?.custom_form || null;
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

  updatingStatus = new Set<number>(); // Track which applications are being updated

  confirmReject(applicationId: number): void {
    const application = this.applications().find(app => app.id === applicationId) || this.selectedApplication;
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

    const application = this.applications().find(app => app.id === applicationId);
    if (!application) {
      this.toastr.error('لم يتم العثور على الطلب');
      return;
    }

    const oldStatus = application.status;
    this.updatingStatus.add(applicationId);
    
    // For optimistic update, we can update the list in the store or just refresh
    // Since we're using a single source of truth in the store, we should ideally ask the store to update
    // But for now, let's just refresh the data after update
    // Or we can manually update the local application object which is a reference to the store data?
    // Store data is readonly from component perspective usually.
    
    // We can't mutate the object directly if it comes from the signal in strict mode, but let's see.
    // Ideally we should have an updateStatus action in the store.
    
    // For now, let's call the API and then refresh the store.
    
    // Optimistic update: update store immediately
    this.store.updateApplicationStatus(applicationId, newStatus);
    
    this.applicationService.updateApplicationStatus(applicationId, newStatus).subscribe({
      next: (updatedApp) => {
        // Update store with the actual response from API
        this.store.updateApplicationStatus(applicationId, newStatus, updatedApp);
        this.toastr.success('تم تحديث حالة الطلب بنجاح');
        this.updatingStatus.delete(applicationId);
      },
      error: (err) => {
        console.error('Failed to update application status', err);
        // Revert optimistic update on error
        this.store.updateApplicationStatus(applicationId, oldStatus);
        this.toastr.error('فشل في تحديث حالة الطلب. يرجى المحاولة مرة أخرى');
        this.updatingStatus.delete(applicationId);
      }
    });
  }
}

