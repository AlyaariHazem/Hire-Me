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
import { LoaderService } from 'shared/services/loader.service';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePicker } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { InterviewsStoreService } from '../services/interviews.store';

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
    DatePicker,
    InputNumberModule,
    TextareaModule,
    ProgressSpinnerModule,
    PaginatorModule
  ],
  templateUrl: './interviews.html',
  styleUrls: ['./interviews.scss']
})
export class Interviews extends Base implements OnInit {
  private interviewService = inject(InterviewService);
  private applicationService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  private loaderService = inject(LoaderService);
  private store = inject(InterviewsStoreService);

  // Data signals from store
  interviews = this.store.interviews;
  applications = signal<{ id: number; label: string }[]>([]);
  loading = this.store.loading;
  
  // Filter state from store
  statusFilter = computed(() => this.store.filters().status);
  interviewTypeFilter = computed(() => this.store.filters().interviewType);
  
  // Modal state
  showScheduleModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  selectedInterview = signal<Interview | null>(null);
  editingInterview = signal<Interview | null>(null);
  isEditMode = signal<boolean>(false);
  loadingDetails = signal<boolean>(false);
  loadingEditData = signal<boolean>(false);
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

  // Computed properties from store
  filteredInterviews = this.interviews; // Store handles filtering via API
  statusCounts = this.store.statusCounts;
  totalCount = this.store.totalCount;
  totalPages = this.store.totalPages;
  currentPage = computed(() => this.store.filters().page);
  page_size = computed(() => this.store.filters().page_size);
  
  // Expose Math to template
  Math = Math;

  ngOnInit(): void {
    this.initForm();
    this.store.init();
    this.loadApplications();
  }

  private initForm(): void {
    this.interviewForm = this.fb.group({
      application: ['', Validators.required],
      interview_type: ['phone', Validators.required],
      scheduled_date: ['', Validators.required],
      scheduled_time: ['', Validators.required],
      duration_minutes: [30, []], // Validators will be set dynamically based on interview type
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
        // Clear duration validators and value when not video
        this.interviewForm.get('duration_minutes')?.clearValidators();
        this.interviewForm.get('duration_minutes')?.setValue(null, { emitEvent: false });
        this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
        // Clear meeting_link validators
        this.interviewForm.get('meeting_link')?.clearValidators();
        this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
      } else {
        // Set duration validators when video is selected
        this.interviewForm.get('duration_minutes')?.setValidators([Validators.required, Validators.min(15), Validators.max(480)]);
        this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
        // Set meeting_link validators
        this.interviewForm.get('meeting_link')?.setValidators([Validators.required]);
        this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
      }
      if (type !== 'in_person') {
        this.interviewForm.patchValue({ location: '' });
        this.interviewForm.get('location')?.clearValidators();
        this.interviewForm.get('location')?.updateValueAndValidity({ emitEvent: false });
      }
    });
    
    // Set initial value
    this.currentInterviewType.set(this.interviewForm.get('interview_type')?.value || 'phone');
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
    this.loadingEditData.set(true);
    this.loaderService.start();
    
    // Load full interview details first
    this.interviewService.getInterviewById(interview.id).subscribe({
      next: (fullInterview) => {
        this.editingInterview.set(fullInterview);
        this.populateFormForEdit(fullInterview);
        this.loadingEditData.set(false);
        this.loaderService.stop();
        this.showScheduleModal.set(true);
      },
      error: (err) => {
        console.error('Failed to load interview for editing', err);
        this.toastr.error('فشل في تحميل بيانات المقابلة');
        this.loadingEditData.set(false);
        this.loaderService.stop();
        this.isEditMode.set(false);
        this.editingInterview.set(null);
      }
    });
  }

  private populateFormForEdit(interview: Interview): void {
    const scheduledDate = new Date(interview.scheduled_date);
    const localDate = this.toLocalDate(scheduledDate);
    // Create a Date object for time picker (timeOnly mode expects a Date object)
    const timeDate = this.buildTimeDate(scheduledDate);
    
    const applicationId = typeof interview.application === 'object' 
      ? interview.application.id 
      : interview.application;

    this.interviewForm.patchValue({
      application: applicationId,
      interview_type: interview.interview_type,
      scheduled_date: localDate,
      scheduled_time: timeDate,
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
      this.interviewForm.get('duration_minutes')?.setValidators([Validators.required, Validators.min(15), Validators.max(480)]);
    } else {
      this.interviewForm.get('meeting_link')?.clearValidators();
      this.interviewForm.get('meeting_link')?.setValue('', { emitEvent: false });
      this.interviewForm.get('duration_minutes')?.clearValidators();
      this.interviewForm.get('duration_minutes')?.setValue(null, { emitEvent: false });
    }
    this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
    this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
    
    // Clear application validators when editing (application shouldn't change)
    if (this.isEditMode()) {
      this.interviewForm.get('application')?.clearValidators();
      this.interviewForm.get('application')?.updateValueAndValidity({ emitEvent: false });
    }
  }

  closeScheduleModal(): void {
    this.showScheduleModal.set(false);
    this.isEditMode.set(false);
    this.editingInterview.set(null);
    this.loadingEditData.set(false);
    this.loaderService.stop(); // Ensure loader is stopped
    this.interviewForm.reset({
      interview_type: 'phone',
      duration_minutes: 30
    });
    this.currentInterviewType.set('phone');
    // Reset validators
    this.interviewForm.get('meeting_link')?.clearValidators();
    this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
    this.interviewForm.get('duration_minutes')?.clearValidators();
    this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
  }

  scheduleInterview(): void {
    if (this.isSubmitting()) {
      return;
    }

    // Ensure validators are correct before validation
    const currentType = this.interviewForm.get('interview_type')?.value || 'phone';
    
    // Update validators based on current interview type
    if (currentType !== 'video') {
      // Clear validators for duration and meeting_link when not video
      this.interviewForm.get('duration_minutes')?.clearValidators();
      this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
      this.interviewForm.get('meeting_link')?.clearValidators();
      this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
    } else {
      // Set validators for video type
      this.interviewForm.get('duration_minutes')?.setValidators([Validators.required, Validators.min(15), Validators.max(480)]);
      this.interviewForm.get('duration_minutes')?.updateValueAndValidity({ emitEvent: false });
      this.interviewForm.get('meeting_link')?.setValidators([Validators.required]);
      this.interviewForm.get('meeting_link')?.updateValueAndValidity({ emitEvent: false });
    }

    if (currentType !== 'in_person') {
      this.interviewForm.get('location')?.clearValidators();
      this.interviewForm.get('location')?.updateValueAndValidity({ emitEvent: false });
    }

    // Validate form after updating validators
    if (this.interviewForm.invalid) {
      this.interviewForm.markAllAsTouched();
      // Log form errors for debugging
      console.log('Form is invalid:', this.interviewForm.errors);
      Object.keys(this.interviewForm.controls).forEach(key => {
        const control = this.interviewForm.get(key);
        if (control?.invalid) {
          console.log(`${key} errors:`, control.errors);
          console.log(`${key} value:`, control.value);
        }
      });
      this.toastr.error('يرجى التحقق من جميع الحقول المطلوبة');
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.interviewForm.value;
    
    // Combine date and time
    // If scheduled_time is a Date object (from timeOnly DatePicker), extract time
    const scheduledDateTime = this.combineDateAndTime(
      this.toLocalDate(formValue.scheduled_date),
      this.getTimeParts(formValue.scheduled_time)
    );
    
    if (this.isEditMode() && this.editingInterview()) {
      // Update existing interview
      const updatePayload: UpdateInterviewDto = {
        interview_type: formValue.interview_type,
        scheduled_date: scheduledDateTime.toISOString(),
        duration_minutes: formValue.interview_type === 'video' ? Number(formValue.duration_minutes) : undefined,
        location: formValue.interview_type === 'in_person' ? (formValue.location || null) : null,
        meeting_link: formValue.interview_type === 'video' ? (formValue.meeting_link || null) : null,
        interviewer_name: formValue.interviewer_name,
        interviewer_email: formValue.interviewer_email,
        notes: formValue.notes || null
      };

      console.log('Updating interview with payload:', updatePayload);
      this.interviewService.patchInterview(this.editingInterview()!.id, updatePayload).subscribe({
        next: (interview) => {
          console.log('Interview updated successfully:', interview);
          // Update interview in store instead of refreshing from API
          this.store.updateInterviewInStore(interview);
          this.toastr.success('تم تحديث المقابلة بنجاح');
          this.closeScheduleModal();
          this.isSubmitting.set(false);
        },
        error: (err) => {
          console.error('Failed to update interview', err);
          console.error('Error details:', err?.error);
          const errorMsg = err?.error?.message || err?.error?.detail || err?.error?.error || 'فشل في تحديث المقابلة';
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
        ...(formValue.interview_type === 'video' && { duration_minutes: Number(formValue.duration_minutes) }),
        location: formValue.interview_type === 'in_person' ? (formValue.location || null) : null,
        meeting_link: formValue.interview_type === 'video' ? (formValue.meeting_link || null) : null,
        interviewer_name: formValue.interviewer_name,
        interviewer_email: formValue.interviewer_email,
        notes: formValue.notes || null
      };

      this.interviewService.createInterview(payload).subscribe({
        next: (interview) => {
          // Add interview to store instead of refreshing from API
          this.store.addInterviewToStore(interview);
          this.toastr.success('تم جدولة المقابلة بنجاح');
          this.closeScheduleModal();
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

  private toLocalDate(value: Date | string | null | undefined): Date {
    if (!value) {
      return new Date();
    }
    const parsedDate = value instanceof Date ? new Date(value) : new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return new Date();
    }
    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  }

  private buildTimeDate(value: Date | string | null | undefined): Date {
    const timeParts = this.getTimeParts(value);
    const timeDate = new Date();
    timeDate.setHours(timeParts.hours, timeParts.minutes, 0, 0);
    timeDate.setSeconds(0);
    timeDate.setMilliseconds(0);
    return timeDate;
  }

  private getTimeParts(value: Date | string | null | undefined): { hours: number; minutes: number } {
    if (value instanceof Date) {
      return { hours: value.getHours(), minutes: value.getMinutes() };
    }
    if (typeof value === 'string' && value) {
      const parsedDate = new Date(value);
      if (!Number.isNaN(parsedDate.getTime())) {
        return { hours: parsedDate.getHours(), minutes: parsedDate.getMinutes() };
      }
      const [hours, minutes] = value.split(':').map(part => Number(part));
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        return { hours, minutes };
      }
    }
    return { hours: 0, minutes: 0 };
  }

  private combineDateAndTime(baseDate: Date, timeParts: { hours: number; minutes: number }): Date {
    const combined = new Date(baseDate);
    combined.setHours(timeParts.hours, timeParts.minutes, 0, 0);
    return combined;
  }

  setStatusFilter(status: StatusFilter): void {
    this.store.setStatusFilter(status);
  }

  setInterviewTypeFilter(type: string): void {
    this.store.setInterviewTypeFilter(type);
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
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'غير محدد';
      }

      // Get local date components (respects timezone)
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      // Arabic month names
      const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];

      // Format time in 12-hour format
      let displayHours = hours;
      let period = 'ص'; // صباح (AM)
      
      if (hours === 0) {
        displayHours = 12;
      } else if (hours === 12) {
        period = 'م'; // مساء (PM)
      } else if (hours > 12) {
        displayHours = hours - 12;
        period = 'م'; // مساء (PM)
      }

      // Format minutes with leading zero
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedHours = displayHours.toString().padStart(2, '0');

      // Format date
      const formattedDate = `${day} ${arabicMonths[month]} ${year}`;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;

      return `${formattedDate} في ${formattedTime}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'غير محدد';
    }
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

  formatDuration(minutes: number | null | undefined): string {
    if (!minutes || minutes <= 0) return 'غير محدد';
    
    // If less than 60 minutes, show as minutes only
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    // If more than 24 hours, calculate days
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      
      if (remainingHours === 0 && remainingMinutes === 0) {
        return `${days} ${days === 1 ? 'يوم' : 'أيام'}`;
      } else if (remainingHours === 0) {
        return `${days} ${days === 1 ? 'يوم' : 'أيام'} و ${remainingMinutes} دقيقة`;
      } else if (remainingMinutes === 0) {
        return `${days} ${days === 1 ? 'يوم' : 'أيام'} و ${remainingHours} ${remainingHours === 1 ? 'ساعة' : 'ساعات'}`;
      } else {
        return `${days} ${days === 1 ? 'يوم' : 'أيام'} و ${remainingHours} ${remainingHours === 1 ? 'ساعة' : 'ساعات'} و ${remainingMinutes} دقيقة`;
      }
    }
    
    // Less than 24 hours, show hours and minutes
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else {
      return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'} و ${remainingMinutes} دقيقة`;
    }
  }

  getApplicantEmail(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    return app?.applicant?.email || 'غير متوفر';
  }

  getApplicantPhone(interview: Interview): string {
    const app = typeof interview.application === 'object' ? interview.application : null;
    return app?.applicant?.phone || 'غير متوفر';
  }

  onPageChange(event: any): void {
    // PrimeNG paginator uses 0-based page index, we use 1-based
    const newPage = event.page + 1;
    const newPageSize = event.rows;
    
    // Update page size if changed
    if (newPageSize !== this.page_size()) {
      this.store.updateFilters({ page_size: newPageSize, page: 1 });
    } else {
      this.store.setPage(newPage);
    }
    
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
