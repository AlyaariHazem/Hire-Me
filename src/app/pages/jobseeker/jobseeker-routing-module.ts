import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { JobSeeker } from './job-seeker';
import { SavedJobs } from './saved-jobs/saved-jobs';
import { Profile } from './profile/profile';

const routes: Routes = [
  {
    path: '',
    component: JobSeeker,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: Dashboard },
      { path: 'saved-jobs', component: SavedJobs },
      { path: 'profile', component: Profile}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobseekerRoutingModule { }
