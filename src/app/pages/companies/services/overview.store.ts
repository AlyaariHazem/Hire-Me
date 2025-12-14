import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, catchError, of } from 'rxjs';
import { ApplicationService, Application } from 'shared/services/application.service';
import { JobService } from 'shared/services/job.service';
import { JobItem } from '../core/models/job-item.model';

export interface OverviewState {
  recentApplications: Application[];
  recentJobs: JobItem[];
  allJobs: JobItem[]; // All jobs for stats calculation
  allApplications: Application[]; // All applications for stats calculation
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
    allJobs: [],
    allApplications: [],
    loadingApplications: false,
    loadingJobs: false,
    loaded: false
  };

  // State signal
  private state = signal<OverviewState>(this.initialState);

  // Selectors
  readonly recentApplications = computed(() => this.state().recentApplications);
  readonly recentJobs = computed(() => this.state().recentJobs);
  readonly allJobs = computed(() => this.state().allJobs);
  readonly allApplications = computed(() => this.state().allApplications);
  readonly loadingApplications = computed(() => this.state().loadingApplications);
  readonly loadingJobs = computed(() => this.state().loadingJobs);

  // Computed stats
  readonly activeJobsThisMonth = computed(() => {
    const jobs = this.allJobs();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return jobs.filter(job => {
      if (!job.is_active) return false;
      const created = new Date(job.created_at);
      return created >= startOfMonth;
    }).length;
  });

  readonly totalApplicantsThisWeek = computed(() => {
    const applications = this.allApplications();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return applications.filter(app => {
      if (!app.applied_at) return false;
      const applied = new Date(app.applied_at);
      return applied >= oneWeekAgo;
    }).length;
  });

  readonly newApplicantsToday = computed(() => {
    const applications = this.allApplications();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return applications.filter(app => {
      if (!app.applied_at) return false;
      const applied = new Date(app.applied_at);
      return applied >= startOfDay;
    }).length;
  });

  readonly totalJobViews = computed(() => {
    const jobs = this.allJobs();
    return jobs.reduce((sum, job) => sum + (job.views_count || 0), 0);
  });

  readonly jobViewsThisWeek = computed(() => {
    const jobs = this.allJobs();
    // For simplicity, we'll estimate views this week as a percentage of total
    // In a real app, you'd track views per time period from the backend
    // For now, we'll return a reasonable estimate based on total views
    const totalViews = this.totalJobViews();
    // Estimate: assume 20% of views are from this week (this is a placeholder)
    return Math.floor(totalViews * 0.2);
  });
  
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
    this.loadAllJobs();
    this.loadAllApplications();
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

  private loadAllJobs(): void {
    // Load all jobs for stats calculation
    this.jobService.getMyJobs({
      ordering: '-created_at',
      page: 1,
      page_size: 1000 // Large page size to get all jobs
    }).subscribe({
      next: (response) => {
        const normalizedJobs = (response.results || []).map(job => ({
          ...job,
          company: job.company ?? { id: 0, name: '-', logo: null, city: '-' },
          category: job.category ?? { id: 0, name: '-' },
        }));
        
        this.patchState({
          allJobs: normalizedJobs
        });
      },
      error: (err) => {
        console.error('Failed to load all jobs', err);
      }
    });
  }

  private loadAllApplications(): void {
    // Load all applications for stats calculation
    this.applicationService.getAllJobApplications({ 
      ordering: '-applied_at',
      page_size: 1000 // Large page size to get all applications
    }).subscribe({
      next: (response) => {
        this.patchState({
          allApplications: response.results || []
        });
      },
      error: (err) => {
        console.error('Failed to load all applications', err);
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
