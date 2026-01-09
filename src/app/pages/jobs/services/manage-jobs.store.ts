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
  page: number;
  page_size: number;
  totalCount: number;
  countActive: number;
  countClosed: number;
}

@Injectable({ providedIn: 'root' })
export class ManageJobsStoreService {
  private jobService = inject(JobService);

  // Initial state
  private initialState: ManageJobsState = {
    jobs: [],
    loading: false,
    activeTab: 'active',
    loaded: false,
    page: 1,
    page_size: 5,
    totalCount: 0,
    countActive: 0,
    countClosed: 0
  };

  // State signal
  private state = signal<ManageJobsState>(this.initialState);

  // Selectors
  readonly jobs = computed(() => this.state().jobs);
  readonly loading = computed(() => this.state().loading);
  readonly activeTab = computed(() => this.state().activeTab);
  readonly page = computed(() => this.state().page);
  readonly page_size = computed(() => this.state().page_size);
  readonly totalCount = computed(() => this.state().totalCount);
  readonly totalPages = computed(() => Math.ceil(this.state().totalCount / this.state().page_size));
  
  // Counts from state (populated from API response)
  readonly countActive = computed(() => this.state().countActive);
  readonly countClosed = computed(() => this.state().countClosed);
  readonly countPaused = computed(() => 0); // Not supported by API yet
  readonly countDraft = computed(() => 0); // Not supported by API yet

  // Visible jobs - now just returns the jobs in state because they are already filtered by backend
  readonly visibleJobs = computed(() => this.state().jobs);

  constructor() {}

  // Actions

  init(): void {
    if (!this.state().loaded) {
      this.loadJobs();
    }
  }

  loadJobs(): void {
    const currentState = this.state();
    this.patchState({ loading: true });

    // Determine filter based on tab
    let is_active: boolean | undefined = undefined;
    if (currentState.activeTab === 'active') is_active = true;
    else if (currentState.activeTab === 'closed') is_active = false;
    // 'paused' and 'draft' currently map to nothing or false depending on requirements,
    // assuming 'paused' might mean inactive for now or not handled.
    // For now, let's stick to the user's current logic where 'paused' isn't fully implemented in API
    // but the UI has logic for it.
    
    // API request with filter
    this.jobService.getMyJobs({ 
      page: currentState.page, 
      page_size: currentState.page_size, 
      ordering: '-created_at',
      ...((is_active !== undefined) && { is_active }) // Only add is_active if defined
    }).subscribe({
      next: res => {
        const list = (res?.results ?? []).map((j: any) => ({
          ...j,
          company: j.company ?? { id: 0, name: '-', logo: null, city: '-' },
          category: j.category ?? { id: 0, name: '-' },
        }));

        this.patchState({
          jobs: list,
          loading: false,
          loaded: true,
          totalCount: res?.count || 0,
          // Update global counts from response if available
          countActive: res?.active ?? currentState.countActive,
          countClosed: res?.inactive ?? currentState.countClosed
        });
      },
      error: err => {
        console.error('Failed to load jobs', err);
        this.patchState({ 
          jobs: [],
          loading: false,
          totalCount: 0
        });
      }
    });
  }

  setTab(tab: TabKey): void {
    // When switching tabs, reset page to 1
    if (this.state().activeTab !== tab) {
      this.patchState({ activeTab: tab, page: 1 });
      this.loadJobs();
    }
  }

  setPage(page: number): void {
    this.patchState({ page });
    this.loadJobs();
  }

  setPageSize(pageSize: number): void {
    this.patchState({ page_size: pageSize, page: 1 });
    this.loadJobs();
  }
  
  refresh(): void {
    this.loadJobs();
  }

  updateJobStatus(slug: string, id: number, newStatus: 'active' | 'paused' | 'closed'): Observable<JobItem> {
     const isActive = newStatus === 'active';
     // Optimistic update could happen, but let's wait for API
     return this.jobService.patchJob(slug, { is_active: isActive }).pipe(
       tap((updatedJob: any) => {
         // After update, reload jobs to refresh list and counts
         // This is safer than optimistic updates when moving between tabs (e.g. active -> closed)
         this.loadJobs();
       })
     );
  }

  private patchState(partialState: Partial<ManageJobsState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
