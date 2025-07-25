import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing-module';
import { SharedModule } from '../../../shared/shared-module';
import { Companies } from './companies';

const components = [
Companies
]
const modules = [
  CommonModule,
  CompaniesRoutingModule,
  SharedModule
]
@NgModule({
  declarations: [...components],
  imports: [
...modules
  ],
  exports:[...modules,...components]
})
export class CompaniesModule { }
