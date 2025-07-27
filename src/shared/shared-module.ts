import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from './header/header';
import { JobDetails } from './job-details/job-details';

const components = [
Header,
Footer,
JobDetails,
];

const modules = [
CommonModule,
RouterLink,
RouterLinkActive
];
@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports: [...components,...modules],
})
export class SharedModule { }
