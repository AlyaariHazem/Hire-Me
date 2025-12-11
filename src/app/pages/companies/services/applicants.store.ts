import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, catchError, of } from 'rxjs';
import { ApplicationService, Application } from 'shared/services/application.service';

export interface ApplicantsState {
  applications: Application[];
  totalCount: number; // Current filtered count
  totalCountAll: number; // Total count when status is 'all' (for "الكل" tab)
  loading: boolean;
  statusCounts: {
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
  filters: {
    page: number;
    pageSize: number;
    status: string; // 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'
    jobId: number | null;
  };
}

@Injectable({ providedIn: 'root' })
export class ApplicantsStoreService {
  private applicationService = inject(ApplicationService);

  // Initial state
  private initialState: ApplicantsState = {
    applications: [],
    totalCount: 0,
    totalCountAll: 0, // Total count for "الكل" tab
    loading: false,
    statusCounts: {
      pending: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0
    },
    filters: {
      page: 1,
      pageSize: 5,
      status: 'all',
      jobId: null
    }
  };

  // State signals
  private state = signal<ApplicantsState>(this.initialState);

  // Selectors
  readonly applications = computed(() => this.state().applications);
  readonly totalCount = computed(() => this.state().totalCount);
  readonly totalCountAll = computed(() => this.state().totalCountAll);
  readonly loading = computed(() => this.state().loading);
  readonly filters = computed(() => this.state().filters);
  readonly statusCounts = computed(() => this.state().statusCounts);
  readonly hasNext = computed(() => {
    const { totalCount, filters } = this.state();
    return filters.page * filters.pageSize < totalCount;
  });
  readonly hasPrevious = computed(() => this.state().filters.page > 1);
  readonly totalPages = computed(() => Math.ceil(this.state().totalCount / this.state().filters.pageSize));

  // Triggers
  private filters$ = new Subject<ApplicantsState['filters']>();

  constructor() {
    this.setupEffect();
  }

  private setupEffect() {
    this.filters$.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(filters => this.patchState({ loading: true, filters })),
      switchMap(filters => {
        const params: any = {
          ordering: '-applied_at',
          page: filters.page,
          pageSize: filters.pageSize
        };

        if (filters.jobId) {
          params.job = filters.jobId;
        }

        if (filters.status !== 'all') {
          params.status = filters.status;
        }

        return this.applicationService.getAllJobApplications(params).pipe(
          catchError(err => {
            console.error('Failed to load applications', err);
            return of({ 
              results: [], 
              count: 0,
              status_counts: {
                pending: 0,
                reviewed: 0,
                accepted: 0,
                rejected: 0
              }
            });
          })
        );
      })
    ).subscribe(response => {
      const currentState = this.state();
      const currentFilters = currentState.filters;
      
      // Only update status_counts and totalCountAll when status filter is 'all' to get accurate counts for all statuses
      // When filtering by a specific status, preserve the existing status_counts and totalCountAll
      let statusCounts = currentState.statusCounts;
      let totalCountAll = currentState.totalCountAll;
      
      if (currentFilters.status === 'all' && response.status_counts) {
        // Update status_counts and totalCountAll only when viewing all applications
        const backendCounts = response.status_counts;
        statusCounts = {
          pending: backendCounts.pending || 0,
          reviewed: backendCounts.reviewed || 0,
          accepted: backendCounts.accepted || 0,
          rejected: backendCounts.rejected || 0
        };
        // Store the total count for "الكل" tab
        totalCountAll = response.count || 0;
      }

      this.patchState({
        applications: response.results || [],
        totalCount: response.count || 0, // Current filtered count
        totalCountAll: totalCountAll, // Preserve or update the total for "الكل"
        statusCounts: statusCounts,
        loading: false
      });
    });
  }

  // Actions
  loadApplicants(page: number = 1) {
    // If explicit page load, we update the page in filters which triggers the effect
    const currentFilters = this.state().filters;
    if (currentFilters.page !== page) {
      this.updateFilters({ page });
    } else {
       // If same page, we might just re-trigger if needed, 
       // but typically we rely on state. If we want to force reload:
       this.filters$.next(currentFilters); 
    }
  }
  
  // This method ensures we start loading if nothing is loaded or if we want to reset
  init() {
    const currentState = this.state();
    
    // If status_counts are not loaded yet (all zeros), first load with 'all' status to get counts
    const needsCounts = currentState.statusCounts.pending === 0 && 
                        currentState.statusCounts.reviewed === 0 && 
                        currentState.statusCounts.accepted === 0 && 
                        currentState.statusCounts.rejected === 0;
    
    if (needsCounts && !currentState.loading) {
      // First, load with 'all' status to get status_counts
      const originalStatus = currentState.filters.status;
      if (originalStatus !== 'all') {
        // Load 'all' first to get counts, then load the requested status
        this.applicationService.getAllJobApplications({
          ordering: '-applied_at',
          page: 1,
          pageSize: currentState.filters.pageSize
        }).subscribe(response => {
          if (response.status_counts) {
            const backendCounts = response.status_counts;
            this.patchState({
              statusCounts: {
                pending: backendCounts.pending || 0,
                reviewed: backendCounts.reviewed || 0,
                accepted: backendCounts.accepted || 0,
                rejected: backendCounts.rejected || 0
              },
              totalCountAll: response.count || 0 // Store total count for "الكل" tab
            });
          }
          // Now load with the original filter
          this.filters$.next(currentState.filters);
        });
      } else {
        // Already 'all', just load normally
        this.filters$.next(currentState.filters);
      }
    } else if (currentState.applications.length === 0 && !currentState.loading) {
      this.filters$.next(currentState.filters);
    }
  }

  setPage(page: number) {
    this.updateFilters({ page });
  }

  setStatusFilter(status: string) {
    this.updateFilters({ status, page: 1 });
  }

  setJobFilter(jobId: number | null) {
    this.updateFilters({ jobId, page: 1 });
  }
  
  refresh() {
    this.filters$.next(this.state().filters);
  }

  private updateFilters(partialFilters: Partial<ApplicantsState['filters']>) {
    const newFilters = { ...this.state().filters, ...partialFilters };
    this.filters$.next(newFilters);
  }

  private patchState(partialState: Partial<ApplicantsState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
