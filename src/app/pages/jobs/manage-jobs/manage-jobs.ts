import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'shared/services/job.service';

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
  jobsActive   = computed(() => this.jobs().filter(j => j.is_active === true));
  jobsClosed   = computed(() => this.jobs().filter(j => j.is_active === false)); // if ever returned
  jobsPaused   = computed(() => [] as JobItem[]); // no field in payload
  jobsDraft    = computed(() => [] as JobItem[]); // no field in payload

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

  constructor(private api: JobService) {}

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
}
