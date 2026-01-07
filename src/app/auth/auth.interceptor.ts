// auth.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from 'shared/services/loader.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private loaderService = inject(LoaderService);
  private auth = inject(AuthService);

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip token refresh for refresh token endpoint and login
    const isRefreshEndpoint = req.url.includes('/token/refresh/');
    const isLoginEndpoint = req.url.includes('/login');

    const token = localStorage.getItem('access');
    let authReq = req;

    // Add authorization header if token exists and it's not a refresh/login request
    if (token && !isRefreshEndpoint && !isLoginEndpoint) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Only attempt refresh on 401 errors, and skip if it's already a refresh request
        if (err.status === 401 && !isRefreshEndpoint && !isLoginEndpoint) {
          return this.handle401Error(req, next);
        }
        
        // For 403 or other errors, or if refresh endpoint fails, logout
        if ((err.status === 401 || err.status === 403) && isRefreshEndpoint) {
          this.auth.logout();
          this.router.navigateByUrl('');
        }
        
        return throwError(() => err);
      }),
      finalize(() => this.loaderService.stop())
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Try to refresh the token
    return this.auth.refreshToken().pipe(
      switchMap((newAccessToken: string) => {
        // Retry the original request with the new token
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newAccessToken}`
          }
        });
        return next.handle(clonedReq);
      }),
      catchError((refreshErr) => {
        // If refresh fails, logout and redirect
        this.auth.logout();
        this.router.navigateByUrl('');
        return throwError(() => refreshErr);
      })
    );
  }
}
