import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  throwError,
  finalize
} from 'rxjs';
import { environment } from 'environments/environment';

type ApiRes<T> = { data: { profile: T } };

export interface Profile {
  company_logo: string;
  id: number;
  company_name: string;
  // ...other fields
}

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
  private readonly profileSubject = new BehaviorSubject<Profile | null>(null);
  readonly profile$ = this.profileSubject.asObservable();

  private loading = false; // prevent duplicate calls
  private loaded = false;  // track if we already have data
  http = inject(HttpClient);

  constructor() {}

  /**
   * Public stream: subscribe anywhere (header, layout, etc).
   * If not loaded yet, will auto-fetch once.
   */
  getProfile$(forceRefresh = false): Observable<Profile | null> {
    if ((this.loaded && !forceRefresh) || this.loading) {
      // already loaded or in progress → just return stream
      return this.profile$;
    }

    this.fetchProfile();
    return this.profile$;
  }

  /**
   * Manually trigger reload, e.g. after profile update.
   */
  refreshProfile(): void {
    this.fetchProfile(true);
  }

  /**
   * Internal fetch handler
   */
  private fetchProfile(force = false): void {
    if (this.loading) return;

    if (!force && this.loaded && this.profileSubject.value) {
      return;
    }

    this.loading = true;

    const url = environment.getUrl('profile', 'accounts');

    this.http.get<ApiRes<Profile>>(url).pipe(
      tap((res) => {
        const profile = res?.data?.profile;
        if (profile) {
          this.profileSubject.next(profile);
          this.loaded = true;
        } else {
          // optional: handle unexpected empty response
          this.profileSubject.next(null);
        }
      }),
      catchError((err) => {
        // keep last good value, but don't mark as loaded so it can retry later
        this.loaded = false;
        return throwError(() => err);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }
}
