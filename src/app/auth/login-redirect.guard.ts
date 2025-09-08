import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const loginRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true; // stay on login if no token

  // Has token → send to saved area (defaults to jobseeker)
  const role = auth.role ?? 'jobseeker';
  const target = role === 'employer' ? '/companies' : '/jobseeker';
  return router.createUrlTree([target]);
};
