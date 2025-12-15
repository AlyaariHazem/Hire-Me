import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InterviewService, Interview, InterviewType, InterviewStatus } from 'shared/services/interview.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { SkeletonModule } from 'primeng/skeleton';
import { Base } from 'shared/base/base';
import { LoaderService } from 'shared/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

type StatusFilter = 'all' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

@Component({
  selector: 'app-jobseeker-interviews',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    SkeletonModule,
    RouterModule,
    ProgressSpinnerModule
  ],
  templateUrl: './interviews.html',
  styleUrls: ['./interviews.scss']
})
export class JobseekerInterviews extends Base implements OnInit {
  private interviewService = inject(InterviewService);
  private loaderService = inject(LoaderService);

  // Data signals
  interviews = signal<Interview[]>([]);
  loading = signal<boolean>(false);

  // Filter state
  statusFilter = signal<StatusFilter>('all');
  interviewTypeFilter = signal<string>('all');

  // Modal state
  showDetailsModal = signal<boolean>(false);
  selectedInterview = signal<Interview | null>(null);
  loadingDetails = signal<boolean>(false);

  // Interview types
  interviewTypes: { label: string; value: InterviewType | string }[] = [
    { label: 'هاتفي', value: 'phone' },
    { label: 'فيديو', value: 'video' },
    { label: 'شخصي', value: 'in_person' },
    { label: 'تقني', value: 'technical' },
    { label: 'موارد بشرية', value: 'hr' },
    { label: 'نهائي', value: 'final' }
  ];

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
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.loading.set(true);
    this.loaderService.start();

    this.interviewService.getInterviews().subscribe({
      next: (response) => {
        this.interviews.set(response.results || []);
        this.loading.set(false);
        this.loaderService.stop();
      },
      error: (err) => {
        console.error('Failed to load interviews', err);
        this.toastr.error('فشل في تحميل المقابلات');
        this.loading.set(false);
        this.loaderService.stop();
      }
    });
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
  }

  setInterviewTypeFilter(type: string): void {
    this.interviewTypeFilter.set(type);
  }

  openDetailsModal(interview: Interview): void {
    this.selectedInterview.set(interview);
    this.loadingDetails.set(true);
    this.loaderService.start();

    this.interviewService.getInterviewById(interview.id).subscribe({
      next: (fullInterview) => {
        this.selectedInterview.set(fullInterview);
        this.loadingDetails.set(false);
        this.loaderService.stop();
        this.showDetailsModal.set(true);
      },
      error: (err) => {
        console.error('Failed to load interview details', err);
        this.toastr.error('فشل في تحميل تفاصيل المقابلة');
        this.loadingDetails.set(false);
        this.loaderService.stop();
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal.set(false);
    this.selectedInterview.set(null);
    this.loadingDetails.set(false);
    this.loaderService.stop();
  }

  getInterviewTypeLabel(type: string): string {
    const found = this.interviewTypes.find(t => t.value === type);
    return found?.label || type;
  }

  getStatusLabel(status: string | undefined): string {
    const statusLabels: Record<string, string> = {
      scheduled: 'مجدولة',
      completed: 'مكتملة',
      cancelled: 'ملغاة',
      rescheduled: 'إعادة جدولة'
    };
    return statusLabels[status || ''] || status || 'غير محدد';
  }

  getStatusClass(status: string | undefined): string {
    const statusClasses: Record<string, string> = {
      scheduled: 'status-scheduled',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      rescheduled: 'status-rescheduled'
    };
    return statusClasses[status || ''] || 'status-default';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getApplicationInfo(interview: Interview): { jobTitle: string; companyName: string } {
    const application = interview.application;
    if (typeof application === 'object' && application?.job) {
      return {
        jobTitle: application.job.title || 'غير محدد',
        companyName: application.job.company?.name || 'غير محدد'
      };
    }
    return { jobTitle: 'غير محدد', companyName: 'غير محدد' };
  }

  openMeetingLink(link: string | null): void {
    if (link) {
      window.open(link, '_blank');
    }
  }
}
