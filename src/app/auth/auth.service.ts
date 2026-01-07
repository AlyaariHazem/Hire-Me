import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { switchMap, catchError, tap, filter, take } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';
import { UserRole } from 'core/types';
import { ProfileStoreService } from 'shared/services/profile.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private profileStore = inject(ProfileStoreService);
  private router = inject(Router);
  private http = inject(HttpClient);
  constructor(private state: AuthStateService) {}

  // Track if a refresh is in progress to prevent multiple simultaneous refresh requests
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // English: convenience wrappers
  isLoggedIn() { return this.state.isLoggedIn(); }   // returns boolean at call time
  get role()   { return this.state.role(); }         // current role value

  setTokens(access?: string | null, refresh?: string | null) {
    // Store both access and refresh tokens
    this.state.setAuth(access ?? null, this.state.role(), refresh ?? null);
  }

  setRole(role: UserRole) {
    this.state.setAuth(this.state.token() ?? null, role);
  }

  refreshToken(): Observable<string> {
    const refresh = this.state.refreshToken();
    
    if (!refresh) {
      return throwError(() => new Error('No refresh token available'));
    }

    // If refresh is already in progress, return the existing subject
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          if (token instanceof Error) {
            return throwError(() => token);
          }
          return of(token as string);
        })
      );
    }

    // Start refresh process
    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    // API endpoint: POST /api/token/refresh/
    const refreshUrl = `${environment.apiBaseUrl}/api/token/refresh/`;
    
    return this.http.post(refreshUrl, { refresh }).pipe(
      switchMap((res: any) => {
        const newAccess = res?.access || res?.data?.access;
        const newRefresh = res?.refresh || res?.data?.refresh || refresh; // Keep old refresh if new one not provided
        
        if (newAccess) {
          this.setTokens(newAccess, newRefresh);
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(newAccess);
          return of(newAccess);
        } else {
          this.refreshTokenInProgress = false;
          const error = new Error('Invalid refresh response');
          this.refreshTokenSubject.error(error);
          return throwError(() => error);
        }
      }),
      catchError((err) => {
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.error(err);
        // If refresh fails, logout
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout() {
    // Clear auth state (removes tokens and role from localStorage and signals)
    this.state.clear();
    // Clear profile store to remove stale user data
    this.profileStore.reset();
    // Navigate to login page with full reload to clear all state/guards
    // 
    // this.router.navigateByUrl('/login');
    setTimeout(() => {
      window.location.href = '/Hire-Me/login';
    }, 100);
  }
}
