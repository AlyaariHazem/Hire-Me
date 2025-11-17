import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, switchMap, map, tap } from 'rxjs';
import { environment } from 'environments/environment';

type ApiRes<T> = { data: { profile: T } };

export interface Profile {
  id: number;
  company_name: string;
  company_logo: string;
  profile: {
    company_logo: string;
  };
  user: {
    first_name: string;
    last_name: string;
    profile_picture: string;
  };
  // ...other fields
}

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
  http = inject(HttpClient);

  private readonly profileSubject = new BehaviorSubject<Profile | null>(null);
  readonly profile$ = this.profileSubject.asObservable();

  private readonly reload$ = new Subject<void>();
  private readonly url = environment.getUrl('profile', 'accounts');

  // English: flags to control one-time load
  private loaded = false;
  private loading = false;

  constructor() {
    this.reload$
      .pipe(
        switchMap(() => this.http.get<ApiRes<Profile>>(this.url)),
        map(res => res?.data?.profile ?? null),
        tap(profile => {
          this.profileSubject.next(profile);
          this.loaded = true;
          this.loading = false;
        })
      )
      .subscribe();
  }

  /** English: Call once after login or from many components safely */
  ensureLoaded(): void {
    const hasToken = !!localStorage.getItem('access');
    if (!hasToken) return;

    // English: if already loaded or currently loading, do nothing
    if (this.loaded || this.loading) return;

    this.loading = true;
    this.reload$.next();
  }

  /** English: Force refresh when user updates profile */
  refresh(): void {
    const hasToken = !!localStorage.getItem('access');
    if (!hasToken) return;
    // English: refresh is allowed even if already loaded
    this.loading = true;
    this.reload$.next();
  }

  get snapshot(): Profile | null {
    return this.profileSubject.value;
  }

  reset(): void {
    this.loaded = false;
    this.loading = false;
    this.profileSubject.next(null);
  }
}

