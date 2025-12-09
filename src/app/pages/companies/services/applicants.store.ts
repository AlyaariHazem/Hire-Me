import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, catchError, of } from 'rxjs';
import { ApplicationService, Application } from 'shared/services/application.service';

export interface ApplicantsState {
  applications: Application[];
  totalCount: number;
  loading: boolean;
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
    loading: false,
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
  readonly loading = computed(() => this.state().loading);
  readonly filters = computed(() => this.state().filters);
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
          page_size: filters.pageSize
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
            return of({ results: [], count: 0 });
          })
        );
      })
    ).subscribe(response => {
      this.patchState({
        applications: response.results || [],
        totalCount: response.count || 0,
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
    if (this.state().applications.length === 0 && !this.state().loading) {
       this.filters$.next(this.state().filters);
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
