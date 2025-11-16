// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from 'shared/services/loader.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router,
    private loaderService: LoaderService,
    private auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access');
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Token ${token}` } })
      : req;
       this.loaderService.start();

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // English: on 401, optionally redirect to login
        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.router.navigateByUrl('');
        }
        return throwError(() => err);
      }),
      finalize(() => this.loaderService.stop())
    );
  }
}
