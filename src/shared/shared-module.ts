import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from './header/header';
import { JobDetails } from './job-details/job-details';
import { SearchForJob } from './search-for-job/search-for-job';
import { Messages } from './messages/messages';
import { FormsModule } from '@angular/forms';

const components = [
Header,
Footer,
JobDetails,
SearchForJob,
Messages
];

const modules = [
CommonModule,
RouterLink,
FormsModule,
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
