import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home';
import { SharedModule } from '../../../shared/shared-module';

const components = [
  Home
]
const modules = [
  SharedModule,
  CommonModule,
  HomeRoutingModule
]
@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports:[...modules,...components]
})
export class HomeModule { }
