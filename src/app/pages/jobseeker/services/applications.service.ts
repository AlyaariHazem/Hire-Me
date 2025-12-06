import { Injectable, inject } from '@angular/core';
import { Subject, Observable, filter, exhaustMap, tap, shareReplay, map, catchError, of, BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthStateService } from 'app/auth/auth-state.service';
import { ApplicationService, Application, ApplicationListResponse } from 'shared/services/application.service';

export type ApplicationStatus = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface ApplicationsData {
  applications: Application[];
  statusCounts: {
    all: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ApplicationsStoreService {
  private auth = inject(AuthStateService);
  private applicationService = inject(ApplicationService);

  // Trigger for loading applications data
  private readonly trigger$ = new Subject<void>();

  // Loading state flags
  private loaded = false;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  // Applications data observable
  readonly applications$: Observable<ApplicationsData> = this.trigger$.pipe(
    filter(() => this.auth.isLoggedIn()),
    exhaustMap(() => {
      this.loadingSubject.next(true);
      return this.loadApplicationsData();
    }),
    tap(() => {
      this.loaded = true;
      this.loadingSubject.next(false);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Signal for templates
  readonly applications = toSignal(this.applications$, {
    initialValue: { applications: [], statusCounts: { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 } } as ApplicationsData
  });

  // Snapshot for synchronous access
  private _snapshot: ApplicationsData = {
    applications: [],
    statusCounts: { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
  };
  get snapshot(): ApplicationsData {
    return this._snapshot;
  }

  /**
   * Load applications data from backend
   */
  private loadApplicationsData(): Observable<ApplicationsData> {
    return this.applicationService.getMyApplications().pipe(
      map((response: ApplicationListResponse) => {
        const applications = response.results || [];
        const statusCounts = this.calculateStatusCounts(applications);
        
        const data: ApplicationsData = {
          applications,
          statusCounts
        };
        
        this._snapshot = data;
        return data;
      }),
      catchError((err) => {
        console.error('Failed to load applications', err);
        const emptyData: ApplicationsData = {
          applications: [],
          statusCounts: { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
        };
        this._snapshot = emptyData;
        return of(emptyData);
      })
    );
  }

  /**
   * Calculate status counts from applications array
   */
  private calculateStatusCounts(applications: Application[]): ApplicationsData['statusCounts'] {
    return {
      all: applications.length,
      pending: applications.filter((app) => app.status === 'pending').length,
      reviewed: applications.filter((app) => app.status === 'reviewed').length,
      accepted: applications.filter((app) => app.status === 'accepted').length,
      rejected: applications.filter((app) => app.status === 'rejected').length,
    };
  }

  /**
   * Get filtered applications by status
   */
  getFilteredApplications(status: ApplicationStatus): Application[] {
    const apps = this._snapshot.applications;
    if (status === 'all') {
      return apps;
    }
    return apps.filter((app) => app.status === status);
  }

  /**
   * Safe to call from many components; only the first call actually loads
   */
  ensureLoaded(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loaded || this.loadingSubject.value) return;
    this.trigger$.next();
  }

  /**
   * Force reload (after actions that might change applications data)
   */
  refresh(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loadingSubject.value) return;
    this.loaded = false;
    this.trigger$.next();
  }

  /**
   * Clear everything on logout
   */
  reset(): void {
    this.loaded = false;
    this.loadingSubject.next(false);
    this._snapshot = {
      applications: [],
      statusCounts: { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
    };
  }
}

