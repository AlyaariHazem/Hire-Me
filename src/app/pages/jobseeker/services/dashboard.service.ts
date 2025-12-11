import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, filter, exhaustMap, tap, shareReplay, map, forkJoin, catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AuthStateService } from 'app/auth/auth-state.service';
import { JobService, JobStatistics } from 'shared/services/job.service';
import { ApplicationService, Application, ApplicationListResponse } from 'shared/services/application.service';
import { JobItem } from '@app/companies/models';

export interface DashboardData {
  stats: JobStatistics | null;
  recentApplications: Application[];
  savedJobs: JobItem[];
}

@Injectable({ providedIn: 'root' })
export class DashboardStoreService {
  private http = inject(HttpClient);
  private auth = inject(AuthStateService);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);

  // Trigger for loading dashboard data
  private readonly trigger$ = new Subject<void>();

  // Loading state flags
  private loaded = false;
  private loading = false;

  // Dashboard data observable
  readonly dashboard$: Observable<DashboardData> = this.trigger$.pipe(
    filter(() => this.auth.isLoggedIn()),
    exhaustMap(() => this.loadDashboardData()),
    tap(() => {
      this.loaded = true;
      this.loading = false;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Signal for templates
  readonly dashboard = toSignal(this.dashboard$, { 
    initialValue: { stats: null, recentApplications: [], savedJobs: [] } as DashboardData 
  });

  // Snapshot for synchronous access
  private _snapshot: DashboardData = { stats: null, recentApplications: [], savedJobs: [] };
  get snapshot(): DashboardData {
    return this._snapshot;
  }

  /**
   * Load dashboard data from backend
   */
  private loadDashboardData(): Observable<DashboardData> {
    // Load all data in parallel using forkJoin
    const stats$ = this.jobService.getJobStatistics().pipe(
      catchError((err) => {
        console.error('Failed to load stats', err);
        return of(null);
      })
    );

    const applications$ = this.applicationService.getMyApplications({ pageSize: 3 }).pipe(
      map((data: ApplicationListResponse) => data.results || []),
      catchError((err) => {
        console.error('Failed to load applications', err);
        return of([]);
      })
    );

    const savedJobs$ = this.jobService.getBookmarkedJobs({ pageSize: 5 }).pipe(
      map((data) => {
        if (data.results && data.results.length > 0) {
          return data.results.map((item: any) => item.job ? item.job : item);
        }
        return [];
      }),
      catchError((err) => {
        console.error('Failed to load saved jobs', err);
        return of([]);
      })
    );

    // Combine all observables in parallel
    return forkJoin({
      stats: stats$,
      recentApplications: applications$,
      savedJobs: savedJobs$
    }).pipe(
      map((data) => {
        this._snapshot = data;
        return data;
      })
    );
  }

  /**
   * Safe to call from many components; only the first call actually loads
   */
  ensureLoaded(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loaded || this.loading) return;
    this.loading = true;
    this.trigger$.next();
  }

  /**
   * Force reload (after actions that might change dashboard data)
   */
  refresh(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loading) return;
    this.loaded = false;
    this.loading = true;
    this.trigger$.next();
  }

  /**
   * Clear everything on logout
   */
  reset(): void {
    this.loaded = false;
    this.loading = false;
    this._snapshot = { stats: null, recentApplications: [], savedJobs: [] };
  }
}

