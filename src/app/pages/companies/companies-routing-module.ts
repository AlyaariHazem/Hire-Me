import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { PostJob } from '../jobs/manage-jobs/post-job/post-job';
import { CompanyProfile } from './company-profile/company-profile';
import { CompanyData } from './company-data/company-data';
import { ProfileComponent } from './profile/profile';
import { JobDetails } from 'app/pages/jobs/job-details/job-details';
import { Jobs } from '../jobs/jobs';
import { ManageJobs } from '../jobs/manage-jobs/manage-jobs';

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
        component: ProfileComponent,
      },
      {
        path: 'company-data',
        component: CompanyData

      },
      {
        path: 'post-job',
        component: PostJob,
      },
      {
        path: 'jobs',
        component: Jobs
      },
      {
        path: 'manage-jobs',
        component: ManageJobs
      },
      {
        path: 'job-details',
        component: JobDetails
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
