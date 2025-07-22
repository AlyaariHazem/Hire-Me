import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Companies } from './companies';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: Companies
      }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }
