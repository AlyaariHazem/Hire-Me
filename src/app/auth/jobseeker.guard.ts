import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Guard to protect job seeker routes
 * Only allows access if user is logged in AND has 'jobseeker' role
 * Redirects employers to their dashboard
 */
export const jobseekerGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Check if user is logged in
  if (!auth.isLoggedIn()) {
    toastr.warning('يجب تسجيل الدخول أولاً');
    return router.createUrlTree(['']);
  }

  // Check if user is a job seeker
  const role = auth.role;
  if (role !== 'jobseeker') {
    // User is an employer, redirect to their dashboard
    toastr.warning('هذه الصفحة متاحة فقط للباحثين عن عمل');
    return router.createUrlTree(['/companies']);
  }

  // User is a job seeker, allow access
  return true;
};

