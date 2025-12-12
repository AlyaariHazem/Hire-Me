import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, catchError, of } from 'rxjs';
import { ApplicationService, Application } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';
import { JobItem } from '../core/models/job-item.model';

export interface OverviewState {
  recentApplications: Application[];
  recentJobs: JobItem[];
  loadingApplications: boolean;
  loadingJobs: boolean;
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class OverviewStoreService {
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);

  // Initial state
  private initialState: OverviewState = {
    recentApplications: [],
    recentJobs: [],
    loadingApplications: false,
    loadingJobs: false,
    loaded: false
  };

  // State signal
  private state = signal<OverviewState>(this.initialState);

  // Selectors
  readonly recentApplications = computed(() => this.state().recentApplications);
  readonly recentJobs = computed(() => this.state().recentJobs);
  readonly loadingApplications = computed(() => this.state().loadingApplications);
  readonly loadingJobs = computed(() => this.state().loadingJobs);
  
  constructor() {}

  // Actions

  init(): void {
    if (!this.state().loaded) {
      this.loadDashboardData();
    }
  }

  loadDashboardData(): void {
    this.patchState({ loaded: true }); // Mark as loaded to prevent re-entry
    this.loadRecentApplications();
    this.loadRecentJobs();
  }

  private loadRecentApplications(): void {
    this.patchState({ loadingApplications: true });
    this.applicationService.getAllJobApplications({ 
      ordering: '-applied_at',
      page_size: 4 
    }).subscribe({
      next: (response) => {
        this.patchState({
          recentApplications: response.results || [],
          loadingApplications: false
        });
      },
      error: (err) => {
        console.error('Failed to load recent applications', err);
        this.patchState({ loadingApplications: false });
      }
    });
  }

  private loadRecentJobs(): void {
    this.patchState({ loadingJobs: true });
    this.jobService.getMyJobs({
      ordering: '-created_at',
      page: 1,
      page_size: 3
    }).subscribe({
      next: (response) => {
        const normalizedJobs = (response.results || []).map(job => ({
          ...job,
          company: job.company ?? { id: 0, name: '-', logo: null, city: '-' },
          category: job.category ?? { id: 0, name: '-' },
        }));
        
        this.patchState({
          recentJobs: normalizedJobs,
          loadingJobs: false
        });
      },
      error: (err) => {
        console.error('Failed to load recent jobs', err);
        this.patchState({ loadingJobs: false });
      }
    });
  }

  refresh(): void {
    this.loadDashboardData();
  }

  private patchState(partialState: Partial<OverviewState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
