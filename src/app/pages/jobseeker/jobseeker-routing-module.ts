import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { JobSeeker } from './job-seeker';
import { SavedJobs } from './saved-jobs/saved-jobs';
import { Profile } from './profile/profile';
import { CV } from './cv/cv';
import { Alerts } from './alerts/alerts';
import { Settings } from './settings/settings';
import { CvBuilder } from './cv-builder/cv-builder';
import { Applications } from './applications/applications';
import { Jobs } from '../jobs/jobs';

const routes: Routes = [
  {
    path: '',
    component: JobSeeker,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, data: { breadcrumb: 'لوحة التحكم' } },
      { path: 'saved-jobs', component: SavedJobs, data: { breadcrumb: 'الوظائف المحفوظة' } },
      { path: 'profile', component: Profile, data: { breadcrumb: 'الملف الشخصي' } },
      { path: 'cv', component: CV, data: { breadcrumb: 'السيرة الذاتية' } },
      { path: 'cv-builder', component: CvBuilder, data: { breadcrumb: 'إنشاء السيرة الذاتية' } },
      { path: 'alerts', component: Alerts, data: { breadcrumb: 'تنبيهات الوظائف' } },
      { path: 'applications', component: Applications, data: { breadcrumb: 'طلباتي' } },
      { path: 'settings', component: Settings, data: { breadcrumb: 'الإعدادات' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'jobs',
        component: Jobs,
        data: { breadcrumb: 'الوظائف' }
      },
      {
        path: 'job-details/:slug',
        loadComponent: () =>
          import('./../jobs/job-details/job-details').then(
            (c) => c.JobDetails
          ),
        data: { breadcrumb: 'تفاصيل الوظيفة' }
        },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JobseekerRoutingModule {}
