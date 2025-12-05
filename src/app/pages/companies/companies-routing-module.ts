import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { PostJob } from '../jobs/manage-jobs/post-job/post-job';
import { CompanyProfile } from './company-profile/company-profile';
import { CompanyData } from './company-data/company-data';
import { ProfileComponent } from './profile/profile';
import { UserEditComponent } from './user-edit/user-edit';
import { JobDetails } from 'app/pages/jobs/job-details/job-details';
import { Jobs } from '../jobs/jobs';
import { ManageJobs } from '../jobs/manage-jobs/manage-jobs';
import { ApplicantsForJob } from './applicants-for-job/applicants-for-job';
import { Applicants } from './applicants/applicants';
import { Messages } from 'shared/messages/messages';

const routes: Routes = [
  {
    path: '',
    component: Companies,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: Dashboard,
        data: { breadcrumb: 'لوحة التحكم' }
      },
      {
        path: 'company-profile',
        component: CompanyProfile,
        data: { breadcrumb: 'ملف الشركة' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: 'الملف الشخصي' }
      },
      {
        path: 'user-edit',
        component: UserEditComponent,
        data: { breadcrumb: 'تعديل البيانات' }
      },
      {
        path: 'company-data',
        component: CompanyData,
        data: { breadcrumb: 'بيانات الشركة' }
      },
      {
        path: 'post-job',
        component: PostJob,
        data: { breadcrumb: 'نشر وظيفة' }
      },
      {
        path: 'jobs',
        component: Jobs,
        data: { breadcrumb: 'الوظائف' }
      },
      {
        path: 'manage-jobs',
        component: ManageJobs,
        data: { breadcrumb: 'إدارة الوظائف' }
      },
      {
        path: 'job-details',
        component: JobDetails,
        data: { breadcrumb: 'تفاصيل الوظيفة' }
      },
      {
        path: 'job-details/:slug',
        loadComponent: () =>
          import('./../jobs/job-details/job-details').then(
            (c) => c.JobDetails
          ),
        data: { breadcrumb: 'تفاصيل الوظيفة' }
        },
      {
        path: 'applicants',
        component: Applicants,
        data: { breadcrumb: 'المتقدمون' }
      },
      {
        path: 'messages',
        component: Messages,
        data: { breadcrumb: 'الرسائل' }
      },
      {
        path: 'applicants-for-job',
        component: ApplicantsForJob,
        data: { breadcrumb: 'المتقدمون للوظيفة' }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
