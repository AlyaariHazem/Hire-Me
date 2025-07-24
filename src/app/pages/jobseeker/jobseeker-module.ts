import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobseekerRoutingModule } from './jobseeker-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { SavedJobs } from './saved-jobs/saved-jobs';
import { JobDetails } from '../jobs/job-details/job-details';
import { JobSeeker } from './job-seeker';
import { SideBar } from './side-bar/side-bar';
import { RouterLink } from '@angular/router';
import { Profile } from './profile/profile';

const components = [
  Dashboard,
  SavedJobs,
  SideBar,
  JobDetails,
  JobSeeker,
  Profile
];

const modules = [
CommonModule,
RouterLink
];
@NgModule({
  declarations: [...components],
  imports: [...modules, JobseekerRoutingModule],
  exports: [...components, JobseekerRoutingModule]
})
export class JobseekerModule {}
