import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay, catchError, throwError, Observable } from 'rxjs';
import { environment } from 'environments/environment';

type ApiRes<T> = { data: { profile: T } };
export interface Profile {
  company_logo: string;
  // ...other fields you need
}

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
  private cache$?: Observable<Profile>;
  public http!: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getProfile$() {
    if (!this.cache$) {
      const url = environment.getUrl('profile', 'accounts');
      this.cache$ = this.http.get<ApiRes<Profile>>(url).pipe(
        map(res => res.data.profile),
        shareReplay({ bufferSize: 1, refCount: false }), // cache for all subscribers
        catchError(err => {
          // if first load fails, clear cache so next call retries
          this.cache$ = undefined;
          return throwError(() => err);
        })
      );
    }
    return this.cache$;
  }

  /** Call this after you update the profile so next read refetches */
  invalidateCache() {
    this.cache$ = undefined;
  }
}
