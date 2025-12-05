import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';

type TabKey = 'active' | 'paused' | 'closed' | 'draft';
  export interface JobItem {
  id: number;
  title: string;
  slug: string;
  job_type: string;
  experience_level: string;
  city: string;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_negotiable: boolean;
  created_at: string;
  company?: { id: number; name: string; logo: string | null; city: string };
  category?: { id: number; name: string };

  // fields seen in the API
  is_active?: boolean;
  is_featured?: boolean;
  is_urgent?: boolean;
  views_count?: number;
  applications_count?: number;
}

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-jobs.html',
  styleUrls: ['./manage-jobs.scss'],
})
export class ManageJobs implements OnInit {
  // English: raw list
  private jobs = signal<JobItem[]>([]);

  // English: current tab
  activeTab = signal<TabKey>('active');

  // English: bucket the list using the available fields
  // Note: API currently only supports is_active (true/false)
  // For now, we'll treat:
  // - is_active: true = active
  // - is_active: false = closed/paused (we can't distinguish without additional API fields)
  jobsActive   = computed(() => this.jobs().filter(j => j.is_active === true));
  jobsClosed   = computed(() => this.jobs().filter(j => j.is_active === false));
  jobsPaused   = computed(() => [] as JobItem[]); // No separate field in API yet
  jobsDraft    = computed(() => [] as JobItem[]); // No separate field in API yet

  // English: counts for the tabs
  countActive = computed(() => this.jobsActive().length);
  countClosed = computed(() => this.jobsClosed().length);
  countPaused = computed(() => this.jobsPaused().length);
  countDraft  = computed(() => this.jobsDraft().length);

  // English: list visible based on the active tab
  visibleJobs = computed(() => {
    switch (this.activeTab()) {
      case 'active': return this.jobsActive();
      case 'closed': return this.jobsClosed();
      case 'paused': return this.jobsPaused();
      case 'draft':  return this.jobsDraft();
    }
  });

  loading = false;
  updatingStatus: Record<number, boolean> = {}; // Track which job is being updated

  constructor(
    private api: JobService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  // English: pull employer jobs
  fetch(): void {
    this.loading = true;
    this.api.getMyJobs({ page: 1, page_size: 50, ordering: '-created_at' }).subscribe({
      next: res => {
        // English: normalize a bit so templates are safe
        const list = (res?.results ?? []).map(j => ({
          ...j,
          company: j.company ?? { id: 0, name: '-', logo: null, city: '-' },
          category: j.category ?? { id: 0, name: '-' },
        }));
        this.jobs.set(list);
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load jobs', err);
        this.jobs.set([]);
        this.loading = false;
      }
    });
  }

  // English: tab click
  selectTab(key: TabKey) {
    this.activeTab.set(key);
  }

  // English: minor helpers for template
  companyName(j: JobItem): string {
    return (j as any).company_name || j.company?.name || '-';
  }

  salaryText(j: JobItem): string {
    if (j.salary_min && j.salary_max) return `${j.salary_min} - ${j.salary_max}`;
    if (j.is_salary_negotiable) return 'قابل للتفاوض';
    return '—';
  }

  // Update job status
  updateJobStatus(job: JobItem, newStatus: 'active' | 'paused' | 'closed'): void {
    if (this.updatingStatus[job.id]) return;

    this.updatingStatus[job.id] = true;
    
    // Determine is_active value based on status
    // Note: API currently only supports is_active boolean
    // For paused/closed, both will set is_active to false
    // If API later adds separate fields, we can update this logic
    const isActive = newStatus === 'active';
    
    // Update the job using PATCH
    this.api.patchJob(job.slug, { is_active: isActive }).subscribe({
      next: (updatedJob) => {
        // Update the job in the list
        const currentJobs = this.jobs();
        const index = currentJobs.findIndex(j => j.id === job.id);
        if (index !== -1) {
          currentJobs[index] = { ...currentJobs[index], is_active: updatedJob.is_active };
          this.jobs.set([...currentJobs]);
        }
        
        const statusMessages: Record<string, string> = {
          active: 'تم تفعيل الوظيفة بنجاح',
          paused: 'تم إيقاف الوظيفة مؤقتاً',
          closed: 'تم إغلاق الوظيفة'
        };
        this.toastr.success(statusMessages[newStatus] || 'تم تحديث حالة الوظيفة');
        this.updatingStatus[job.id] = false;
      },
      error: (err) => {
        console.error('Failed to update job status', err);
        this.toastr.error('فشل في تحديث حالة الوظيفة');
        this.updatingStatus[job.id] = false;
      }
    });
  }

  getJobStatus(job: JobItem): 'active' | 'paused' | 'closed' {
    // Since API only has is_active boolean, we map:
    // - true = active
    // - false = closed (we can't distinguish paused without additional API field)
    // TODO: Update when API adds separate paused/draft fields
    if (job.is_active === true) return 'active';
    return 'closed'; // Default to closed for false/undefined
  }

  isUpdating(jobId: number): boolean {
    return this.updatingStatus[jobId] || false;
  }
}
