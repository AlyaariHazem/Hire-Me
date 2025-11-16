import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, switchMap, map, tap, shareReplay, startWith } from 'rxjs';
import { environment } from 'environments/environment';

type ApiRes<T> = { data: { profile: T } };

export interface Profile {
  id: number;
  company_name: string;
  company_logo: string;
  // ...other fields
}

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
   http = inject(HttpClient);

  // English: external read-only stream for consumers
  readonly profile$: Observable<Profile | null>;

  // English: internal trigger to (re)load the profile
  private readonly reload$ = new Subject<void>();

  // English: local cache of last value if you need instant synchronous access
  private lastValue: Profile | null = null;

  // English: single source of truth URL
  private readonly url = environment.getUrl('profile', 'accounts');

  private loaded = false; // English: guarantees first auto-load happens once

  constructor() {
    // English: when 'reload$' fires, perform one HTTP request and multicast it
    this.profile$ = this.reload$.pipe(
      // English: perform the HTTP call
      switchMap(() => this.http.get<ApiRes<Profile>>(this.url)),
      map(res => res?.data?.profile ?? null),
      tap(p => { this.lastValue = p; this.loaded = true; }),
      // English: cache last emission for late subscribers, avoid duplicate HTTP
      shareReplay({ bufferSize: 1, refCount: true })
    );

    // English: prime the stream with a no-op so late subscribers see last value even before first reload
    // (startWith doesn't fire HTTP; it only makes the stream "hot" for subscribers)
    this.profile$ = this.profile$.pipe(startWith(this.lastValue));
  }

  /** English: Call once after login or when you know you need employer data. Safe to call multiple times. */
  ensureLoaded(): void {
    const hasToken = !!localStorage.getItem('access');
    if (!hasToken) return;
    if (!this.loaded) this.reload$.next();
  }

  /** English: Force refresh after updating profile data */
  refresh(): void {
    const hasToken = !!localStorage.getItem('access');
    if (!hasToken) return;
    this.reload$.next();
  }

  /** English: Optional sync getter for already cached value */
  get snapshot(): Profile | null {
    return this.lastValue;
  }

  /** English: Reset cache on logout */
  reset(): void {
    this.loaded = false;
    this.lastValue = null;
    // Note: no need to emit null; consumers can handle it.
  }
}
