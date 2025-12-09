import { Injectable, computed, inject, signal } from '@angular/core';
import { ApplicationService } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';

export interface SidebarState {
  activeJobsCount: number;
  newApplicantsCount: number;
  loading: boolean;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class SidebarStoreService {
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);

  // Initial state
  private initialState: SidebarState = {
    activeJobsCount: 0,
    newApplicantsCount: 0,
    loading: false,
    loaded: false
  };

  // State signal
  private state = signal<SidebarState>(this.initialState);

  // Selectors
  readonly activeJobsCount = computed(() => this.state().activeJobsCount);
  readonly newApplicantsCount = computed(() => this.state().newApplicantsCount);
  readonly loading = computed(() => this.state().loading);

  constructor() {}

  init(): void {
    if (!this.state().loaded) {
      this.loadStats();
    }
  }

  refresh(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.patchState({ loading: true });

    // Load active jobs count (using statistics endpoint)
    this.jobService.getJobStatistics().subscribe({
      next: (stats) => {
        this.patchState({ activeJobsCount: stats.total_jobs || 0 });
      },
      error: (err) => {
        console.error('Failed to load job stats', err);
      }
    });

    // Load new applicants count (using status='pending')
    this.applicationService.getAllJobApplications({ status: 'pending', page_size: 1 }).subscribe({
      next: (res) => {
        this.patchState({ newApplicantsCount: res.count, loading: false, loaded: true });
      },
      error: (err) => {
        console.error(err);
        this.patchState({ loading: false });
      }
    });
  }

  private patchState(partialState: Partial<SidebarState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
