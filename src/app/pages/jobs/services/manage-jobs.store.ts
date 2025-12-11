import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap, catchError, map } from 'rxjs';
import { JobService } from 'shared/services/job.service';

// Duplicating type locally or importing from component/model if available. 
// Ideally should be in a shared model file, but sticking to what was in component.
export type TabKey = 'active' | 'paused' | 'closed' | 'draft';

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
  is_active?: boolean;
  is_featured?: boolean;
  is_urgent?: boolean;
  views_count?: number;
  applications_count?: number;
}

export interface ManageJobsState {
  jobs: JobItem[];
  loading: boolean;
  activeTab: TabKey;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class ManageJobsStoreService {
  private jobService = inject(JobService);

  // Initial state
  private initialState: ManageJobsState = {
    jobs: [],
    loading: false,
    activeTab: 'active',
    loaded: false
  };

  // State signal
  private state = signal<ManageJobsState>(this.initialState);

  // Selectors
  readonly jobs = computed(() => this.state().jobs);
  readonly loading = computed(() => this.state().loading);
  readonly activeTab = computed(() => this.state().activeTab);
  
  // Computed groups
  readonly jobsActive = computed(() => this.jobs().filter(j => j.is_active === true));
  readonly jobsClosed = computed(() => this.jobs().filter(j => j.is_active === false));
  readonly jobsPaused = computed(() => [] as JobItem[]); 
  readonly jobsDraft = computed(() => [] as JobItem[]);

  // Counts
  readonly countActive = computed(() => this.jobsActive().length);
  readonly countClosed = computed(() => this.jobsClosed().length);
  readonly countPaused = computed(() => this.jobsPaused().length);
  readonly countDraft = computed(() => this.jobsDraft().length);

  // Visible jobs based on tab
  readonly visibleJobs = computed(() => {
    switch (this.activeTab()) {
      case 'active': return this.jobsActive();
      case 'closed': return this.jobsClosed();
      case 'paused': return this.jobsPaused();
      case 'draft':  return this.jobsDraft();
    }
  });

  constructor() {}

  // Actions

  init(): void {
    if (!this.state().loaded) {
      this.loadJobs();
    }
  }

  loadJobs(): void {
    this.patchState({ loading: true });
    this.jobService.getMyJobs({ page: 1, pageSize: 50, ordering: '-created_at' }).subscribe({
      next: res => {
        const list = (res?.results ?? []).map((j: any) => ({
          ...j,
          company: j.company ?? { id: 0, name: '-', logo: null, city: '-' },
          category: j.category ?? { id: 0, name: '-' },
        }));
        this.patchState({
          jobs: list,
          loading: false,
          loaded: true
        });
      },
      error: err => {
        console.error('Failed to load jobs', err);
        this.patchState({ 
          jobs: [],
          loading: false 
        });
      }
    });
  }

  setTab(tab: TabKey): void {
    this.patchState({ activeTab: tab });
  }
  
  refresh(): void {
    this.loadJobs();
  }

  updateJobStatus(slug: string, id: number, newStatus: 'active' | 'paused' | 'closed'): Observable<JobItem> {
     const isActive = newStatus === 'active';
     // Optimistic update could happen, but let's wait for API
     return this.jobService.patchJob(slug, { is_active: isActive }).pipe(
       tap((updatedJob: any) => {
         const currentJobs = this.state().jobs;
         const index = currentJobs.findIndex(j => j.id === id);
         if (index !== -1) {
           const updatedList = [...currentJobs];
           updatedList[index] = { ...updatedList[index], is_active: updatedJob.is_active };
           this.patchState({ jobs: updatedList });
         }
       })
     );
  }

  private patchState(partialState: Partial<ManageJobsState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
