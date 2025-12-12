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
import { Applications } from './applications/applications';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './services/profile.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SkeletonModule } from 'primeng/skeleton';
const components = [
  Dashboard,
  JobSeeker,
  Profile,
  CV,
  Alerts,
  Settings,
  CvBuilder,
  Applications,
];

const modules = [
CommonModule,
RouterLinkActive,
RouterLink,
SideBar,
SavedJobs,
SharedModule,
ReactiveFormsModule,
FormsModule,
InputTextModule,
InputNumberModule,
TextareaModule,
Select,
ButtonModule,
DatePickerModule,
CheckboxModule,
DialogModule,
SkeletonModule
];
@NgModule({
  declarations: [...components],
  imports: [...modules, JobseekerRoutingModule],
  exports: [...components,...modules, JobseekerRoutingModule],
  providers: [HttpClient,ProfileService]
})
export class JobseekerModule {}
