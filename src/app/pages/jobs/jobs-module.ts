import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing-module';
import { Jobs } from './jobs';
import { SharedModule } from '../../../shared/shared-module';

const components = [
  Jobs
]
const modules = [
  CommonModule,
  JobsRoutingModule,
  SharedModule
]
@NgModule({
  declarations: [...components],
  imports: [
...modules
  ],
  exports:[
    ...modules,...components
  ]
})
export class JobsModule { }
