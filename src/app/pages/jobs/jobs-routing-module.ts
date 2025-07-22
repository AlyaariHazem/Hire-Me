import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Jobs } from './jobs';

const routes: Routes = [
  {
    path:'',
    children: [
      {
        path: '',
        component: Jobs
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
