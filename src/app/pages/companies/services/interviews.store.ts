import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, catchError, of } from 'rxjs';
import { InterviewService, Interview, InterviewListResponse } from 'shared/services/interview.service';

type StatusFilter = 'all' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface InterviewsState {
  interviews: Interview[];
  totalCount: number;
  loading: boolean;
  filters: {
    page: number;
    page_size: number;
    status: StatusFilter;
    interviewType: string; // 'all' | 'phone' | 'video' | etc.
  };
}

@Injectable({ providedIn: 'root' })
export class InterviewsStoreService {
  private interviewService = inject(InterviewService);

  // Initial state
  private initialState: InterviewsState = {
    interviews: [],
    totalCount: 0,
    loading: false,
    filters: {
      page: 1,
      page_size: 5,
      status: 'all',
      interviewType: 'all'
    }
  };

  // State signals
  private state = signal<InterviewsState>(this.initialState);

  // Selectors
  readonly interviews = computed(() => this.state().interviews);
  readonly totalCount = computed(() => this.state().totalCount);
  readonly loading = computed(() => this.state().loading);
  readonly filters = computed(() => this.state().filters);
  readonly hasNext = computed(() => {
    const { totalCount, filters } = this.state();
    return filters.page * filters.page_size < totalCount;
  });
  readonly hasPrevious = computed(() => this.state().filters.page > 1);
  readonly totalPages = computed(() => Math.ceil(this.state().totalCount / this.state().filters.page_size));

  // Status counts computed from current interviews
  readonly statusCounts = computed(() => {
    const interviews = this.state().interviews;
    return {
      all: this.state().totalCount,
      scheduled: interviews.filter(i => i.status === 'scheduled').length,
      completed: interviews.filter(i => i.status === 'completed').length,
      cancelled: interviews.filter(i => i.status === 'cancelled').length,
      rescheduled: interviews.filter(i => i.status === 'rescheduled').length
    };
  });

  // Triggers
  private filters$ = new Subject<InterviewsState['filters']>();

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
          page: filters.page,
          page_size: filters.page_size
        };

        if (filters.status !== 'all') {
          params.status = filters.status;
        }

        if (filters.interviewType !== 'all') {
          params.interview_type = filters.interviewType;
        }

        return this.interviewService.getInterviews(params).pipe(
          catchError(err => {
            console.error('Failed to load interviews', err);
            return of<InterviewListResponse>({ 
              results: [], 
              count: 0,
              next: null,
              previous: null
            });
          })
        );
      })
    ).subscribe(response => {
      this.patchState({
        interviews: response.results || [],
        totalCount: response.count || 0,
        loading: false
      });
    });
  }

  // Actions
  init() {
    const currentState = this.state();
    if (currentState.interviews.length === 0 && !currentState.loading) {
      this.filters$.next(currentState.filters);
    }
  }

  setPage(page: number) {
    this.updateFilters({ page });
  }

  setStatusFilter(status: StatusFilter) {
    this.updateFilters({ status, page: 1 });
  }

  setInterviewTypeFilter(interviewType: string) {
    this.updateFilters({ interviewType, page: 1 });
  }

  refresh() {
    this.filters$.next(this.state().filters);
  }

  // Update interview in store after API update
  updateInterviewInStore(updatedInterview: Interview) {
    const currentState = this.state();
    const updatedInterviews = currentState.interviews.map(interview =>
      interview.id === updatedInterview.id ? updatedInterview : interview
    );
    this.patchState({ interviews: updatedInterviews });
  }

  // Add interview to store after creation
  addInterviewToStore(newInterview: Interview) {
    const currentState = this.state();
    // Add to beginning of list
    const updatedInterviews = [newInterview, ...currentState.interviews];
    this.patchState({ 
      interviews: updatedInterviews,
      totalCount: currentState.totalCount + 1
    });
  }

  // Remove interview from store after deletion
  removeInterviewFromStore(interviewId: number) {
    const currentState = this.state();
    const updatedInterviews = currentState.interviews.filter(i => i.id !== interviewId);
    this.patchState({ 
      interviews: updatedInterviews,
      totalCount: Math.max(0, currentState.totalCount - 1)
    });
  }

  private updateFilters(partialFilters: Partial<InterviewsState['filters']>) {
    const newFilters = { ...this.state().filters, ...partialFilters };
    this.filters$.next(newFilters);
  }

  private patchState(partialState: Partial<InterviewsState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}

