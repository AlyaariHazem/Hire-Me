import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Salary } from './pages/jobs/salary/salary';
import { SearchForJob } from '../shared/search-for-job/search-for-job';

export const routes: Routes = [
  {
    path: '',
    component: Login,
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'salary',
    component: Salary
  },
  {
    path: 'jobs',
    loadChildren: () =>
      import('./pages/jobs/jobs-module').then((m) => m.JobsModule),
  },
  {
    path: 'companies',
    loadChildren: () =>
      import('./pages/companies/companies-module').then(
        (m) => m.CompaniesModule
      ),
  },
  {
    path: 'search-for-company',
    component: SearchForJob
  },
  {
    path: 'jobseeker',
    loadChildren: () =>
      import('./pages/jobseeker/jobseeker-module').then(
        (m) => m.JobseekerModule
      ),
  },
   {
    path: 'account/change-password',
    loadComponent: () =>
      import('./auth/change-password/change-password')
        .then(m => m.ChangePassword)
  },
  {
    path: 'logout',
    redirectTo: '',
    pathMatch: 'full',
  },

  { path: '**', redirectTo: '' },
];
