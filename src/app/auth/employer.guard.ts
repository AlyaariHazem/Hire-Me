import { CanMatchFn, CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Guard to protect employer/company routes
 * Only allows access if user is logged in AND has 'employer' role
 * Redirects job seekers to login page
 */
export const employerGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Check if user is logged in
  if (!auth.isLoggedIn()) {
    toastr.warning('يجب تسجيل الدخول أولاً');
    return router.createUrlTree(['']);
  }

  // Check if user is an employer
  const role = auth.role;
  if (role !== 'employer') {
    // User is a job seeker, redirect to login
    toastr.warning('هذه الصفحة متاحة فقط لأصحاب العمل');
    return router.createUrlTree(['']);
  }

  // User is an employer, allow access
  return true;
};

/**
 * CanActivate version for individual routes
 */
export const employerCanActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Check if user is logged in
  if (!auth.isLoggedIn()) {
    toastr.warning('يجب تسجيل الدخول أولاً');
    return router.createUrlTree(['']);
  }

  // Check if user is an employer
  const role = auth.role;
  if (role !== 'employer') {
    // User is a job seeker, redirect to login
    toastr.warning('هذه الصفحة متاحة فقط لأصحاب العمل');
    return router.createUrlTree(['']);
  }

  // User is an employer, allow access
  return true;
};

