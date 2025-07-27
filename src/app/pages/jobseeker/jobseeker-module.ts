import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobseekerRoutingModule } from './jobseeker-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { SavedJobs } from './saved-jobs/saved-jobs';
import { JobSeeker } from './job-seeker';
import { SideBar } from './side-bar/side-bar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Profile } from './profile/profile';
import { CV } from './cv/cv';
import { Alerts } from './alerts/alerts';
import { Settings } from './settings/settings';
import { SharedModule } from '../../../shared/shared-module';
import { CvBuilder } from './cv-builder/cv-builder';

const components = [
  Dashboard,
  SavedJobs,
  SideBar,
  JobSeeker,
  Profile,
  CV,
  Alerts,
  Settings,
  CvBuilder,
];

const modules = [
CommonModule,
RouterLinkActive,
RouterLink,
SharedModule
];
@NgModule({
  declarations: [...components],
  imports: [...modules, JobseekerRoutingModule],
  exports: [...components,...modules, JobseekerRoutingModule]
})
export class JobseekerModule {}
