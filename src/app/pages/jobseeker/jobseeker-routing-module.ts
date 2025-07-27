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

const routes: Routes = [
  {
    path: '',
    component: JobSeeker,
    children: [
      { path: 'dashboard',  component: Dashboard },
      { path: 'saved-jobs', component: SavedJobs },
      { path: 'profile', component: Profile},
      { path: 'cv', component: CV},
      { path: 'cv-builder', component: CvBuilder},
      { path: 'alerts', component: Alerts},
      { path: 'applications', component: Applications},
      { path: 'settings', component: Settings},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobseekerRoutingModule { }
