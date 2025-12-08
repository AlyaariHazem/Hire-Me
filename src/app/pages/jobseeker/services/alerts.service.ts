import { Injectable, inject } from '@angular/core';
import { Subject, Observable, exhaustMap, tap, shareReplay, map, catchError, of, BehaviorSubject, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { JobService, JobAlert } from 'shared/services/job.service';

export interface AlertsData {
  alerts: JobAlert[];
  categories: { id: number; name: string }[];
}

@Injectable({ providedIn: 'root' })
export class AlertsStoreService {
  private jobService = inject(JobService);

  // Trigger for loading alerts
  private readonly alertsTrigger$ = new Subject<void>();

  // Trigger for loading categories
  private readonly categoriesTrigger$ = new Subject<void>();

  // Loading states
  private loadingAlertsSubject = new BehaviorSubject<boolean>(false);
  readonly loadingAlerts$ = this.loadingAlertsSubject.asObservable();

  private loadingCategoriesSubject = new BehaviorSubject<boolean>(false);
  readonly loadingCategories$ = this.loadingCategoriesSubject.asObservable();

  // Track if data has been loaded
  private alertsLoaded = false;
  private categoriesLoaded = false;

  // Alerts data observable with BehaviorSubject to cache last value
  private alertsDataSubject = new BehaviorSubject<AlertsData>({
    alerts: [],
    categories: []
  });

  readonly alerts$: Observable<AlertsData> = this.alertsDataSubject.asObservable();

  // Categories observable
  readonly categories$: Observable<{ id: number; name: string }[]> = this.categoriesTrigger$.pipe(
    exhaustMap(() => {
      this.loadingCategoriesSubject.next(true);
      return this.loadCategoriesData();
    }),
    tap((categories) => {
      this.loadingCategoriesSubject.next(false);
      this.categoriesLoaded = true;
      // Update categories in the data subject
      const currentData = this.alertsDataSubject.value;
      this.alertsDataSubject.next({
        ...currentData,
        categories
      });
    }),
    startWith(this.alertsDataSubject.value.categories),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Signal for templates
  readonly alerts = toSignal(this.alerts$, {
    initialValue: {
      alerts: [],
      categories: []
    } as AlertsData
  });

  // Snapshot for synchronous access
  get snapshot(): AlertsData {
    return { ...this.alertsDataSubject.value };
  }

  /**
   * Load alerts data from backend
   */
  private loadAlertsData(): Observable<JobAlert[]> {
    return this.jobService.getAlerts().pipe(
      map((response: any) => {
        // Handle both array response and paginated response
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.results)) {
          return response.results;
        } else if (response && Array.isArray(response.alerts)) {
          return response.alerts;
        }
        return [];
      }),
      catchError((err) => {
        console.error('Failed to load alerts', err);
        return of([]);
      })
    );
  }

  /**
   * Alerts observable (private, used internally)
   */
  private alertsList$: Observable<JobAlert[]> = this.alertsTrigger$.pipe(
    exhaustMap(() => {
      this.loadingAlertsSubject.next(true);
      return this.loadAlertsData();
    }),
    tap((alerts) => {
      this.loadingAlertsSubject.next(false);
      this.alertsLoaded = true;
      // Update alerts in the data subject
      const currentData = this.alertsDataSubject.value;
      this.alertsDataSubject.next({
        ...currentData,
        alerts
      });
    }),
    startWith(this.alertsDataSubject.value.alerts),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  /**
   * Load categories data from backend
   */
  private loadCategoriesData(): Observable<{ id: number; name: string }[]> {
    return this.jobService.getCategories().pipe(
      map((response) => response.results || []),
      catchError((err) => {
        console.error('Failed to load categories', err);
        return of([]);
      })
    );
  }

  /**
   * Load alerts
   */
  loadAlerts(): void {
    // Only trigger if not already loaded
    if (!this.alertsLoaded) {
      this.alertsTrigger$.next();
    }
  }

  /**
   * Load categories
   */
  loadCategories(): void {
    // Only trigger if not already loaded
    if (!this.categoriesLoaded) {
      this.categoriesTrigger$.next();
    }
  }

  /**
   * Create a new alert
   */
  createAlert(payload: Partial<JobAlert>): Observable<JobAlert> {
    return this.jobService.createAlert(payload).pipe(
      tap((alert) => {
        // Add alert to current list
        const currentData = this.alertsDataSubject.value;
        const updatedAlerts = [...currentData.alerts, alert];
        this.alertsDataSubject.next({
          ...currentData,
          alerts: updatedAlerts
        });
      })
    );
  }

  /**
   * Update an existing alert
   */
  updateAlert(id: number, payload: Partial<JobAlert>): Observable<JobAlert> {
    return this.jobService.updateAlert(id, payload).pipe(
      tap((updatedAlert) => {
        // Update alert in current list
        const currentData = this.alertsDataSubject.value;
        const updatedAlerts = currentData.alerts.map(alert =>
          alert.id === id ? updatedAlert : alert
        );
        this.alertsDataSubject.next({
          ...currentData,
          alerts: updatedAlerts
        });
      })
    );
  }

  /**
   * Patch (partially update) an alert
   */
  patchAlert(id: number, payload: Partial<JobAlert>): Observable<JobAlert> {
    return this.jobService.patchAlert(id, payload).pipe(
      tap((updatedAlert) => {
        // Update alert in current list
        const currentData = this.alertsDataSubject.value;
        const updatedAlerts = currentData.alerts.map(alert =>
          alert.id === id ? updatedAlert : alert
        );
        this.alertsDataSubject.next({
          ...currentData,
          alerts: updatedAlerts
        });
      })
    );
  }

  /**
   * Delete an alert
   */
  deleteAlert(id: number): Observable<void> {
    return this.jobService.deleteAlert(id).pipe(
      tap(() => {
        // Remove alert from current list
        const currentData = this.alertsDataSubject.value;
        const updatedAlerts = currentData.alerts.filter(alert => alert.id !== id);
        this.alertsDataSubject.next({
          ...currentData,
          alerts: updatedAlerts
        });
      })
    );
  }

  /**
   * Refresh alerts list
   */
  refreshAlerts(): void {
    this.alertsLoaded = false;
    this.loadAlerts();
  }

  /**
   * Refresh categories list
   */
  refreshCategories(): void {
    this.categoriesLoaded = false;
    this.loadCategories();
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this.alertsLoaded = false;
    this.categoriesLoaded = false;
    this.loadingAlertsSubject.next(false);
    this.loadingCategoriesSubject.next(false);
    this.alertsDataSubject.next({
      alerts: [],
      categories: []
    });
  }
}

