import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

import { authGuard } from './auth/auth.guard';
import { loginRedirectGuard } from './auth/login-redirect.guard';
import { Jobs } from './pages/jobs/jobs';

export const routes: Routes = [
  // Login page at root: if logged-in → guard redirects to the app.
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: Login,
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'register',
    component: Register,
  },
  // {
  //   path: 'salary',
  //   component: Salary,
  //   canActivate: [/* optionally protect */]
  // },
  {
    path: 'companies',
    loadChildren: () =>
      import('./pages/companies/companies-module').then(
        (m) => m.CompaniesModule
      ),
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
      import('./pages/jobseeker/jobseeker-module').then(
        (m) => m.JobseekerModule
      ),
    canMatch: [authGuard],
  },
  {
    path: 'jobs',
    component: Jobs,
  },
  // simple logout route that clears storage and returns to login
  {
    path: 'company/:slug',
    loadComponent: () =>
      import('./pages/companies/company-profile/company-profile').then(
        (m) => m.CompanyProfile
      ),
  },
  {
    path: 'logout',
    loadComponent: () => import('./auth/logout/logout').then((m) => m.Logout),
  },
  { path: '**', redirectTo: '' },
];
