import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, finalize } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private router: Router,
    private auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.accessToken;

    // Only attach header if we have a token
    if (token) {
      req = req.clone({ setHeaders: { Authorization: `Token ${token}` } });
    }

    this.loaderService.start();

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // If the token is invalid/expired, clear and go to login
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
