import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing-module';
import { SharedModule } from 'shared/shared-module';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { Candidates } from './candidates/candidates';
import { SideBar } from './side-bar/side-bar';
import { ManageJobs } from './manage-jobs/manage-jobs';
import { Analytics } from './analytics/analytics';
import { CompanyProfile } from './company-profile/company-profile';
import { Billing } from './billing/billing';
import { Overview } from './overview/overview';
import { PostJob } from './post-job/post-job';
import { HeaderCompany } from './header-company/header-company';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyData } from './company-data/company-data';
import { Profile } from './profile/profile';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

const components = [
  Companies,
  Dashboard,
  Candidates,
  SideBar,
  Overview,
  Analytics,
  CompanyProfile,
  Billing,
  HeaderCompany,
  CompanyData,
  Profile,
];
const modules = [
  CommonModule,
  CompaniesRoutingModule,
  SharedModule,
  InputTextModule,
  InputNumberModule,
  ButtonModule,
  PostJob,
  Select,
  ManageJobs,
  FormsModule,
  ReactiveFormsModule,
];
@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...modules, ...components],
})
export class CompaniesModule {}
