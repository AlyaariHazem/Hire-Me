import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

import { authGuard } from './auth/auth.guard';
import { loginRedirectGuard } from './auth/login-redirect.guard';

export const routes: Routes = [
  // Login page at root: if logged-in → guard redirects to the app.
  {
    path: '',
    component: Login,
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'register',
    component: Register
  },
  // {
  //   path: 'salary',
  //   component: Salary,
  //   canActivate: [/* optionally protect */]
  // },
  {
    path: 'jobs',
    loadChildren: () =>
      import('./pages/jobs/jobs-module').then((m) => m.JobsModule),
    canMatch: [authGuard],
  },
  {
    path: 'companies',
    loadChildren: () =>
      import('./pages/companies/companies-module').then((m) => m.CompaniesModule),
    canMatch: [authGuard],
  },
  // {
  //   path: 'search-for-company',
  //   component: SearchForJob,
  //   // optionally protect this too:
  //   // canActivate: [authGuard]
  // },
  {
    path: 'jobseeker',
    loadChildren: () =>
      import('./pages/jobseeker/jobseeker-module').then((m) => m.JobseekerModule),
    canMatch: [authGuard],
  },
  // simple logout route that clears storage and returns to login
  {
    path: 'logout',
    loadComponent: () =>
      import('./auth/logout/logout').then(m => m.Logout)
  },
  { path: '**', redirectTo: '' },
];
