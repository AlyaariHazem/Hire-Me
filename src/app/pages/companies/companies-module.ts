import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing-module';
import { SharedModule } from 'shared/shared-module';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { Candidates } from './candidates/candidates';
import { SideBarCompany } from './side-bar/side-bar';
import { ApplicantsForJob } from './applicants-for-job/applicants-for-job';
import { Applicants } from './applicants/applicants';
import { Analytics } from './analytics/analytics';
import { CompanyProfile } from './company-profile/company-profile';
import { Billing } from './billing/billing';
import { Overview } from './overview/overview';
import { PostJob } from '../jobs/manage-jobs/post-job/post-job';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyData } from './company-data/company-data';
import { ProfileComponent } from './profile/profile';
import { UserEditComponent } from './user-edit/user-edit';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';



const components = [
  Companies,
  Dashboard,
  Candidates,
  Overview,
  Analytics,
  Billing,
  CompanyData,
  ProfileComponent,
  UserEditComponent,
];
const modules = [
  CommonModule,
  CompaniesRoutingModule,
  SharedModule,
  FormsModule,
  ReactiveFormsModule,
  InputTextModule,
  InputNumberModule,
  ButtonModule,
  SelectModule,
  TextareaModule,
  TableModule,
  TooltipModule,
  PostJob,
  ApplicantsForJob,
  Applicants,
  SideBarCompany,
  CompanyProfile,
  ConfirmDialogModule,
];
@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...modules, ...components],
  providers: [ConfirmationService],
})
export class CompaniesModule {}
