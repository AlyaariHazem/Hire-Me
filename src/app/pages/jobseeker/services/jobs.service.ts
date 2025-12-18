import { Injectable, inject } from '@angular/core';
import { Subject, Observable, exhaustMap, tap, shareReplay, map, catchError, of, BehaviorSubject, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { JobService, JobFilters, JobListResponse } from 'shared/services/job.service';
import { JobItem } from '@app/companies/models';

export interface JobsData {
  jobs: JobItem[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
  filters: JobFilters;
}

@Injectable({ providedIn: 'root' })
export class JobsStoreService {
  private jobService = inject(JobService);

  // Trigger for loading jobs data
  private readonly trigger$ = new Subject<JobFilters>();

  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  // Default filters
  private defaultFilters: JobFilters = {
    search: '',
    city: undefined,
    category: undefined,
    job_type: undefined,
    experience_level: undefined,
    ordering: undefined,
    page: 1,
    page_size: 5
  };

  // Current filters state
  private _filters: JobFilters = { ...this.defaultFilters };
  get filters(): JobFilters {
    return { ...this._filters };
  }

  // Track if data has been loaded
  private loaded = false;

  // Track whether to use recommended jobs endpoint
  private useRecommended = false;

  // Jobs data observable with BehaviorSubject to cache last value
  private jobsDataSubject = new BehaviorSubject<JobsData>({
    jobs: [],
    totalJobs: 0,
    totalPages: 0,
    currentPage: 1,
    filters: this.defaultFilters
  });

  readonly jobs$: Observable<JobsData> = this.trigger$.pipe(
    exhaustMap((filters) => {
      this.loadingSubject.next(true);
      return this.loadJobsData(filters);
    }),
    tap((data) => {
      this.loadingSubject.next(false);
      this.loaded = true;
      this.jobsDataSubject.next(data);
    }),
    startWith(this.jobsDataSubject.value),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Signal for templates
  readonly jobs = toSignal(this.jobs$, {
    initialValue: {
      jobs: [],
      totalJobs: 0,
      totalPages: 0,
      currentPage: 1,
      filters: this.defaultFilters
    } as JobsData
  });

  // Snapshot for synchronous access - use BehaviorSubject value
  get snapshot(): JobsData {
    return { ...this.jobsDataSubject.value };
  }

  /**
   * Load jobs data from backend
   */
  private loadJobsData(filters: JobFilters): Observable<JobsData> {
    const requestFilters: JobFilters = {
      ...filters,
      page_size: filters.page_size || 5
    };

    const jobsObservable = this.useRecommended
      ? this.jobService.getRecommendedJobs(requestFilters)
      : this.jobService.getJobs(requestFilters);

    return jobsObservable.pipe(
      map((res: JobListResponse) => {
        // Normalize jobs to ensure company and category are never null
        const jobs = (res.results || []).map(job => ({
          ...job,
          company: job.company || { id: 0, name: '-', logo: null, city: '-' },
          category: job.category || { id: 0, name: '-' },
          is_applied: job.is_applied ?? false
        }));

        const totalJobs = res.count || 0;
        const page_size = requestFilters.page_size || 5;
        const totalPages = Math.ceil(totalJobs / page_size);
        const currentPage = filters.page || 1;

        const data: JobsData = {
          jobs,
          totalJobs,
          totalPages,
          currentPage,
          filters: { ...filters }
        };

        this._filters = { ...filters };
        return data;
      }),
      catchError((err) => {
        console.error('Failed to load jobs', err);
        const emptyData: JobsData = {
          jobs: [],
          totalJobs: 0,
          totalPages: 0,
          currentPage: 1,
          filters: { ...filters }
        };
        return of(emptyData);
      })
    );
  }

  /**
   * Load jobs with current filters
   */
  loadJobs(filters?: Partial<JobFilters>): void {
    const mergedFilters: JobFilters = {
      ...this._filters,
      ...filters,
      page: filters?.page || this._filters.page || 1
    };
    
    // Update internal filters first
    this._filters = { ...mergedFilters };
    
    // Check if filters have changed or if we need to reload
    const filtersChanged = JSON.stringify(mergedFilters) !== JSON.stringify(this.snapshot.filters);
    const pageChanged = mergedFilters.page !== this.snapshot.currentPage;
    
    // Always trigger if explicitly called with filters or if not loaded yet
    // This ensures filters are applied even if they seem the same
    if (!this.loaded || filtersChanged || pageChanged || filters) {
      this.trigger$.next(mergedFilters);
    }
  }

  /**
   * Update filters and reload
   */
  updateFilters(filters: Partial<JobFilters>): void {
    // Force reload by passing filters explicitly
    this.loadJobs({ ...filters, page: 1 });
  }

  /**
   * Set search query
   */
  setSearch(search: string): void {
    this.updateFilters({ search, page: 1 });
  }

  /**
   * Set city filter
   */
  setCity(city: string | undefined): void {
    this.updateFilters({ city: city as any, page: 1 });
  }

  /**
   * Set category filter
   */
  setCategory(category: number | undefined): void {
    this.updateFilters({ category, page: 1 });
  }

  /**
   * Toggle job type filter
   */
  toggleJobType(type: string): void {
    const currentType = this._filters.job_type;
    const newType = currentType === type ? undefined : (type as any);
    this.updateFilters({ job_type: newType, page: 1 });
  }

  /**
   * Toggle experience level filter
   */
  toggleExperienceLevel(level: string): void {
    const currentLevel = this._filters.experience_level;
    const newLevel = currentLevel === level ? undefined : (level as any);
    this.updateFilters({ experience_level: newLevel, page: 1 });
  }

  /**
   * Set sort ordering
   */
  setSorting(sortValue: string): void {
    let ordering: string | undefined;
    switch (sortValue) {
      case 'date':
        ordering = '-created_at';
        break;
      case 'salary':
        ordering = '-salary_max';
        break;
      case 'company':
        ordering = 'company__name';
        break;
      default:
        ordering = undefined;
    }
    this.updateFilters({ ordering, page: 1 });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this._filters = { ...this.defaultFilters };
    this.loadJobs();
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page < 1) return;
    const totalPages = this.snapshot.totalPages;
    if (page > totalPages && totalPages > 0) return;
    
    this.loadJobs({ page });
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    const currentPage = this.snapshot.currentPage;
    const totalPages = this.snapshot.totalPages;
    if (currentPage < totalPages) {
      this.goToPage(currentPage + 1);
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    const currentPage = this.snapshot.currentPage;
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }

  /**
   * Update a job in the current list (e.g., after applying or bookmarking)
   */
  updateJob(jobId: number, updates: Partial<JobItem>): void {
    const currentData = this.jobsDataSubject.value;
    const jobs = [...currentData.jobs];
    const index = jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates };
      const updatedData: JobsData = {
        ...currentData,
        jobs
      };
      this.jobsDataSubject.next(updatedData);
    }
  }

  /**
   * Refresh current jobs list
   */
  refresh(): void {
    this.loadJobs();
  }

  /**
   * Set whether to use recommended jobs endpoint
   */
  setUseRecommended(useRecommended: boolean): void {
    this.useRecommended = useRecommended;
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this._filters = { ...this.defaultFilters };
    this.loaded = false;
    const emptyData: JobsData = {
      jobs: [],
      totalJobs: 0,
      totalPages: 0,
      currentPage: 1,
      filters: this.defaultFilters
    };
    this.jobsDataSubject.next(emptyData);
    this.loadingSubject.next(false);
  }
}

