import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing-module';
import { SharedModule } from '../../../shared/shared-module';
import { Companies } from './companies';
import { Dashboard } from './dashboard/dashboard';
import { Candidates } from './candidates/candidates';
import { SideBar } from './side-bar/side-bar';
import { ManageJobs } from './jobs/manage-jobs';
import { Analytics } from './analytics/analytics';
import { CompanyProfile } from './company-profile/company-profile';
import { Billing } from './billing/billing';
import { Overview } from './overview/overview';

const components = [
Companies,
Dashboard,
Candidates,
SideBar,
Overview,
Analytics,
CompanyProfile,
Billing,
ManageJobs
]
const modules = [
  CommonModule,
  CompaniesRoutingModule,
  SharedModule,
]
@NgModule({
  declarations: [...components],
  imports: [
...modules
  ],
  exports:[...modules,...components]
})
export class CompaniesModule { }
