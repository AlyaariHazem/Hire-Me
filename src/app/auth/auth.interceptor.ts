import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access');

    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Token ${token}` }
      });
    } else {
      this.router.navigateByUrl('#');
    }

    this.loaderService.start();

    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.stop();
      })
    );
  }
}
