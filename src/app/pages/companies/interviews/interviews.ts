import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InterviewService, Interview, CreateInterviewDto, UpdateInterviewDto, InterviewType, InterviewStatus } from 'shared/services/interview.service';
import { ApplicationService, Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { SkeletonModule } from 'primeng/skeleton';
import { Base } from 'shared/base/base';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

type StatusFilter = 'all' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    SkeletonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule
  ],
  templateUrl: './interviews.html',
  styleUrls: ['./interviews.scss']
})
export class Interviews extends Base implements OnInit {
  private interviewService = inject(InterviewService);
  private applicationService = inject(ApplicationService);
  private fb = inject(FormBuilder);

  // Data signals
  interviews = signal<Interview[]>([]);
  applications = signal<{ id: number; label: string }[]>([]);
  loading = signal<boolean>(false);
  
  // Filter state
  statusFilter = signal<StatusFilter>('all');
  interviewTypeFilter = signal<string>('all');
  
  // Modal state
  showScheduleModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  selectedInterview = signal<Interview | null>(null);
  editingInterview = signal<Interview | null>(null);
  isEditMode = signal<boolean>(false);
  loadingDetails = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Form for scheduling interview
  interviewForm!: FormGroup;

  // Interview types
  interviewTypes: { label: string; value: InterviewType | string }[] = [
    { label: 'هاتفي', value: 'phone' },
    { label: 'فيديو', value: 'video' },
    { label: 'شخصي', value: 'in_person' },
    { label: 'تقني', value: 'technical' },
    { label: 'موارد بشرية', value: 'hr' },
    { label: 'نهائي', value: 'final' }
  ];

  // Signal to track interview type for conditional display
  currentInterviewType = signal<string>('phone');

  // Computed properties
  filteredInterviews = computed(() => {
    let filtered = this.interviews();
    
    // Filter by status
    if (this.statusFilter() !== 'all') {
      filtered = filtered.filter(i => i.status === this.statusFilter());
    }
    
    // Filter by type
    if (this.interviewTypeFilter() !== 'all') {
      filtered = filtered.filter(i => i.interview_type === this.interviewTypeFilter());
    }
    
    return filtered;
  });

  statusCounts = computed(() => {
    const all = this.interviews();
    return {
      all: all.length,
      scheduled: all.filter(i => i.status === 'scheduled').length,
      completed: all.filter(i => i.status === 'completed').length,
      cancelled: all.filter(i => i.status === 'cancelled').length,
      rescheduled: all.filter(i => i.status === 'rescheduled').length
    };
  });

  ngOnInit(): void {
    this.initForm();
    this.loadInterviews();
    this.loadApplications();
  }

  private initForm(): void {
    this.interviewForm = this.fb.group({
      application: ['', Validators.required],
      interview_type: ['phone', Validators.required],
      scheduled_date: ['', Validators.required],
      scheduled_time: ['', Validators.required],
      duration_minutes: [30, [Validators.required, Validators.min(15), Validators.max(480)]],
      location: [''],
      meeting_link: [''],
      interviewer_name: ['', Validators.required],
      interviewer_email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });

    // Watch for interview type changes to clear conditional fields and update signal
    this.interviewForm.get('interview_type')?.valueChanges.subscribe(type => {
      this.currentInterviewType.set(type || 'phone');
      if (type !== 'video') {
        this.interviewForm.patchValue({ meeting_link: '' });
      }
      if (type !== 'in_person') {
        this.interviewForm.patchValue({ location: '' });
      }
    });
    
    // Set initial value
    this.currentInterviewType.set(this.interviewForm.get('interview_type')?.value || 'phone');
  }

  loadInterviews(): void {
    this.loading.set(true);
    this.interviewService.getInterviews().subscribe({
      next: (response) => {
        this.interviews.set(response.results || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load interviews', err);
        this.toastr.error('فشل في تحميل المقابلات');
        this.loading.set(false);
      }
    });
  }

  loadApplications(): void {
    this.applicationService.getAllJobApplications().subscribe({
      next: (response) => {
        const apps = response.results || [];
        console.log('Loaded applications:', apps);
        
        // Transform applications for PrimeNG Select component
        const formattedApps = apps
          .filter(app => app && app.id) // Filter out invalid entries
          .map(app => {
            const firstName = app.applicant?.first_name || '';
            const lastName = app.applicant?.last_name || '';
            const jobTitle = app.job?.title || 'غير محدد';
            
            // Create a meaningful label
            let label = '';
            if (firstName || lastName) {
              label = `${firstName} ${lastName}`.trim();
            } else if (app.applicant?.email) {
              label = app.applicant.email;
            } else if (app.applicant?.username) {
              label = app.applicant.username;
            } else {
              label = 'مقدم طلب غير معروف';
            }
            
            label += ` - ${jobTitle}`;
            
            return {
              id: app.id,
              label: label
            };
          });
        
        console.log('Formatted applications:', formattedApps);
        this.applications.set(formattedApps);
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.toastr.error('فشل في تحميل المتقدمين');
        this.applications.set([]);
      }
    });
  }

  openScheduleModal(applicationId?: number): void {
    this.isEditMode.set(false);
    this.editingInterview.set(null);
    if (applicationId) {
      this.interviewForm.patchValue({
        application: applicationId
      });
    }
    this.showScheduleModal.set(true);
  }

  openEditModal(interview: Interview): void {
    this.isEditMode.set(true);
    this.editingInterview.set(interview);
    
    // Load full interview details first
    this.interviewService.getInterviewById(interview.id).subscribe({
      next: (fullInterview) => {
        this.editingInterview.set(fullInterview);
        this.populateFormForEdit(fullInterview);
        this.showScheduleModal.set(true);
      },
      error: (err) => {
        console.error('Failed to load interview for editing', err);
        this.toastr.error('فشل في تحميل بيانات المقابلة');
      }
    });
  }

  private populateFormForEdit(interview: Interview): void {
    const scheduledDate = new Date(interview.scheduled_date);
    const dateStr = scheduledDate.toISOString().split('T')[0];
    const timeStr = `${scheduledDate.getHours().toString().padStart(2, '0')}:${scheduledDate.getMinutes().toString().padStart(2, '0')}`;
    
    const applicationId = typeof interview.application === 'object' 
      ? interview.application.id 
      : interview.application;

    this.interviewForm.patchValue({
      application: applicationId,
      interview_type: interview.interview_type,
      scheduled_date: dateStr,
      scheduled_time: timeStr,
      duration_minutes: interview.duration_minutes,
      location: interview.location || '',
      meeting_link: interview.meeting_link || '',
      interviewer_name: interview.interviewer_name,
      interviewer_email: interview.interviewer_email,
      notes: interview.notes || ''
    }, { emitEvent: false });
    
    // Update the current interview type signal
    this.currentInterviewType.set(interview.interview_type);
    
    // Update validators based on interview type
    if (interview.interview_type === 'video') {
      this.interviewForm.get('meeting_link')?.setValidators([Validators.required]);
    } else {
      this.interviewForm.get('meeting_link')?.clearValidators();
    }
    this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
  }

  closeScheduleModal(): void {
    this.showScheduleModal.set(false);
    this.isEditMode.set(false);
    this.editingInterview.set(null);
    this.interviewForm.reset({
      interview_type: 'phone',
      duration_minutes: 30
    });
    this.currentInterviewType.set('phone');
    // Reset validators
    this.interviewForm.get('meeting_link')?.clearValidators();
    this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
  }

  scheduleInterview(): void {
    if (this.interviewForm.invalid || this.isSubmitting()) {
      this.interviewForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.interviewForm.value;
    
    // Combine date and time
    const scheduledDateTime = new Date(`${formValue.scheduled_date}T${formValue.scheduled_time}`);
    
    if (this.isEditMode() && this.editingInterview()) {
      // Update existing interview
      const updatePayload: UpdateInterviewDto = {
        interview_type: formValue.interview_type,
        scheduled_date: scheduledDateTime.toISOString(),
        duration_minutes: Number(formValue.duration_minutes),
        location: formValue.interview_type === 'in_person' ? (formValue.location || null) : null,
        meeting_link: formValue.interview_type === 'video' ? (formValue.meeting_link || null) : null,
        interviewer_name: formValue.interviewer_name,
        interviewer_email: formValue.interviewer_email,
        notes: formValue.notes || null
      };

      this.interviewService.patchInterview(this.editingInterview()!.id, updatePayload).subscribe({
        next: (interview) => {
          this.toastr.success('تم تحديث المقابلة بنجاح');
          this.closeScheduleModal();
          this.loadInterviews();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Failed to update interview', err);
          const errorMsg = err?.error?.message || err?.error?.detail || 'فشل في تحديث المقابلة';
          this.toastr.error(errorMsg);
          this.isSubmitting.set(false);
        }
      });
    } else {
      // Create new interview
      const payload: CreateInterviewDto = {
        application: Number(formValue.application),
        interview_type: formValue.interview_type,
        scheduled_date: scheduledDateTime.toISOString(),
        duration_minutes: Number(formValue.duration_minutes),
        location: formValue.interview_type === 'in_person' ? (formValue.location || null) : null,
        meeting_link: formValue.interview_type === 'video' ? (formValue.meeting_link || null) : null,
        interviewer_name: formValue.interviewer_name,
        interviewer_email: formValue.interviewer_email,
        notes: formValue.notes || null
      };

      this.interviewService.createInterview(payload).subscribe({
        next: (interview) => {
          this.toastr.success('تم جدولة المقابلة بنجاح');
          this.closeScheduleModal();
          this.loadInterviews();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Failed to schedule interview', err);
          const errorMsg = err?.error?.message || err?.error?.detail || 'فشل في جدولة المقابلة';
          this.toastr.error(errorMsg);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  viewInterview(interview: Interview): void {
    this.selectedInterview.set(interview);
    this.showDetailsModal.set(true);
    this.loadingDetails.set(true);
    
    this.interviewService.getInterviewById(interview.id).subscribe({
      next: (fullInterview) => {
        this.selectedInterview.set(fullInterview);
        this.loadingDetails.set(false);
      },
      error: (err) => {
        console.error('Failed to load interview details', err);
        this.toastr.error('فشل في تحميل تفاصيل المقابلة');
        this.loadingDetails.set(false);
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedInterview.set(null);
    this.loadingDetails.set(false);
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
  }

  setInterviewTypeFilter(type: string): void {
    this.interviewTypeFilter.set(type);
  }

  getStatusLabel(status?: InterviewStatus | string): string {
    const labels: Record<string, string> = {
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
      rescheduled: 'إعادة جدولة'
    };
    return labels[status || ''] || status || 'غير محدد';
  }

  getStatusClass(status?: InterviewStatus | string): string {
    return `status-${status || 'unknown'}`;
  }

  getInterviewTypeLabel(type: InterviewType | string): string {
    const typeMap = this.interviewTypes.find(t => t.value === type);
    return typeMap?.label || type;
  }

  getApplicationName(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    if (app && app.applicant) {
      return `${app.applicant.first_name} ${app.applicant.last_name}`.trim();
    }
    return 'غير معروف';
  }

  getJobTitle(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    return app?.job?.title || 'غير محدد';
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

  formatDate(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getApplicantEmail(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    return app?.applicant?.email || 'غير متوفر';
  }

  getApplicantPhone(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    return app?.applicant?.phone || 'غير متوفر';
  }

  // Expose Math to template
  Math = Math;

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
