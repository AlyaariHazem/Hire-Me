import { Routes } from '@angular/router';
import { Login } from './auth/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Login,
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home-module').then((m) => m.HomeModule),
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
    path: 'jobseeker',
    loadChildren: () =>
      import('./pages/jobseeker/jobseeker-module').then(
        (m) => m.JobseekerModule
      ),
  },

  { path: '**', redirectTo: '' },
];
