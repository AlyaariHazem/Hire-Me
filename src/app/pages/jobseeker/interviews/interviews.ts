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

  formatDate(dateString: string): string {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
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
