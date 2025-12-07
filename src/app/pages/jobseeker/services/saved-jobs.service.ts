import { Injectable, inject } from '@angular/core';
import { Subject, Observable, exhaustMap, tap, shareReplay, map, catchError, of, BehaviorSubject, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { JobService, JobFilters } from 'shared/services/job.service';
import { JobItem } from '@app/companies/models';

// Bookmark wrapper returned by API
export interface BookmarkedJobItem {
  id: number; // bookmark id
  job: JobItem; // actual job payload
  created_at: string; // when it was bookmarked
}

// List response for bookmarks
export interface BookmarkedJobsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookmarkedJobItem[];
}

export interface SavedJobsData {
  bookmarks: BookmarkedJobItem[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class SavedJobsStoreService {
  private jobService = inject(JobService);

  // Trigger for loading saved jobs data
  private readonly trigger$ = new Subject<{ page: number; pageSize: number }>();

  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  // Track if data has been loaded
  private loaded = false;

  // Default pagination
  private defaultPage = 1;
  private defaultPageSize = 10;

  // Current pagination state
  private _page = this.defaultPage;
  private _pageSize = this.defaultPageSize;

  get page(): number {
    return this._page;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  // Saved jobs data observable with BehaviorSubject to cache last value
  private savedJobsDataSubject = new BehaviorSubject<SavedJobsData>({
    bookmarks: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  });

  readonly savedJobs$: Observable<SavedJobsData> = this.trigger$.pipe(
    exhaustMap(({ page, pageSize }) => {
      this.loadingSubject.next(true);
      return this.loadSavedJobsData(page, pageSize);
    }),
    tap((data) => {
      this.loadingSubject.next(false);
      this.loaded = true;
      this.savedJobsDataSubject.next(data);
    }),
    startWith(this.savedJobsDataSubject.value),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Signal for templates
  readonly savedJobs = toSignal(this.savedJobs$, {
    initialValue: {
      bookmarks: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0
    } as SavedJobsData
  });

  // Snapshot for synchronous access
  get snapshot(): SavedJobsData {
    return { ...this.savedJobsDataSubject.value };
  }

  /**
   * Load saved jobs data from backend
   */
  private loadSavedJobsData(page: number, pageSize: number): Observable<SavedJobsData> {
    return this.jobService.getBookmarkedJobs({
      page,
      page_size: pageSize,
    }).pipe(
      map((res: any) => {
        const data = res as BookmarkedJobsResponse;
        const bookmarks = data.results ?? [];
        const totalCount = data.count ?? 0;
        const totalPages = pageSize > 0
          ? Math.max(1, Math.ceil(totalCount / pageSize))
          : 1;

        const savedJobsData: SavedJobsData = {
          bookmarks,
          totalCount,
          currentPage: page,
          pageSize,
          totalPages
        };

        this._page = page;
        this._pageSize = pageSize;
        return savedJobsData;
      }),
      catchError((err) => {
        console.error('Failed to load saved jobs', err);
        const emptyData: SavedJobsData = {
          bookmarks: [],
          totalCount: 0,
          currentPage: page,
          pageSize,
          totalPages: 0
        };
        return of(emptyData);
      })
    );
  }

  /**
   * Load saved jobs with current pagination
   */
  loadSavedJobs(page?: number, pageSize?: number): void {
    const targetPage = page ?? this._page;
    const targetPageSize = pageSize ?? this._pageSize;

    // Check if page changed or not loaded yet
    const pageChanged = targetPage !== this.snapshot.currentPage;
    const pageSizeChanged = targetPageSize !== this.snapshot.pageSize;

    // Always trigger if explicitly called with different page/size or not loaded yet
    if (!this.loaded || pageChanged || pageSizeChanged || page !== undefined || pageSize !== undefined) {
      this.trigger$.next({ page: targetPage, pageSize: targetPageSize });
    }
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page < 1) return;
    const totalPages = this.snapshot.totalPages;
    if (page > totalPages && totalPages > 0) return;
    if (page === this._page) return;

    this.loadSavedJobs(page);
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
   * Remove bookmark and update list
   */
  removeBookmark(jobId: number): Observable<any> {
    return this.jobService.bookmarkJob(jobId).pipe(
      tap(() => {
        // Remove from current list
        const currentData = this.savedJobsDataSubject.value;
        const updatedBookmarks = currentData.bookmarks.filter(
          (bookmark) => bookmark.job.id !== jobId
        );
        const updatedData: SavedJobsData = {
          ...currentData,
          bookmarks: updatedBookmarks,
          totalCount: Math.max(0, currentData.totalCount - 1),
          totalPages: this._pageSize > 0
            ? Math.max(1, Math.ceil((currentData.totalCount - 1) / this._pageSize))
            : 1
        };
        this.savedJobsDataSubject.next(updatedData);
      })
    );
  }

  /**
   * Refresh current saved jobs list
   */
  refresh(): void {
    this.loaded = false;
    this.loadSavedJobs();
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this._page = this.defaultPage;
    this._pageSize = this.defaultPageSize;
    this.loaded = false;
    const emptyData: SavedJobsData = {
      bookmarks: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0
    };
    this.savedJobsDataSubject.next(emptyData);
    this.loadingSubject.next(false);
  }
}

