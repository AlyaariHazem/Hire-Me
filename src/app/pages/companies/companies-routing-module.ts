import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { PostJob } from './post-job/post-job';
import { CompanyProfile } from './company-profile/company-profile';
import { CompanyData } from './company-data/company-data';
import { Profile } from './profile/profile';

const routes: Routes = [
  {
    path: '',
    component: Companies,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'company-profile',
        component:CompanyProfile
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'company-data',
        component: CompanyData

      },
      {
        path: 'post-job',
        component: PostJob,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
