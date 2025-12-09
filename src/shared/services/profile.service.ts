import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, filter, map, shareReplay, exhaustMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from 'environments/environment';
import { AuthStateService } from 'app/auth/auth-state.service';

type ApiRes<T> = { data: { profile: T } };

export interface Profile {
  id: number;
  company_name: string;
  company_logo: string;
  profile: { company_logo: string };
  industry: string;
  user: { first_name: string; last_name: string; profile_picture: string; user_type: string };
  // ...other fields
}

@Injectable({ providedIn: 'root' })
export class ProfileStoreService {
   http = inject(HttpClient);
  private auth = inject(AuthStateService);

  private readonly url = environment.getUrl('profile', 'accounts');

  // English: no initial emission. Only fires when we explicitly next()
  private readonly trigger$ = new Subject<void>();

  // English: internal guards so repeated ensureLoaded() does nothing
  private loaded = false;
  private loading = false;

  // English: one shared request; exhaustMap prevents overlaps; shareReplay caches last value
  readonly profile$: Observable<Profile | null> = this.trigger$.pipe(
    // English: only load when logged in
    filter(() => this.auth.isLoggedIn()),
    exhaustMap(() => this.http.get<ApiRes<Profile>>(this.url)),
    map(res => res?.data?.profile ?? null),
    tap(p => {
      this._snapshot = p;
      this.loaded = true;
      this.loading = false;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // English: signal for templates; no manual unsubscribe
  readonly profile = toSignal(this.profile$, { initialValue: null });

  // English: cheap synchronous read for TS
  private _snapshot: Profile | null = null;
  get snapshot(): Profile | null { return this._snapshot; }

  /** English: safe to call from many components; only the first call actually loads */
  ensureLoaded(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loaded || this.loading) return;   // <-- prevents your second call
    this.loading = true;
    this.trigger$.next();
  }

  /** English: force reload (after editing profile, etc.) */
  refresh(): void {
    if (!this.auth.isLoggedIn()) return;
    if (this.loading) return;
    this.loaded = false;        // English: allow a new load
    this.loading = true;
    this.trigger$.next();
  }

  /** English: clear everything on logout */
  reset(): void {
    this.loaded = false;
    this.loading = false;
    this._snapshot = null;
  }
}
