import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from './header/header';
import { JobDetails } from './job-details/job-details';
import { SearchForJob } from './search-for-job/search-for-job';
import { Messages } from './messages/messages';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HeaderPublic } from './header-public/header-public';
import { JobService } from './services/job.service';
import { ProfileStoreService } from './services/profile.service';

const components = [
Header,
Footer,
JobDetails,
SearchForJob,
Messages,
ProgressSpinnerComponent,
HeaderPublic
];

const modules = [
CommonModule,
RouterLink,
FormsModule,
RouterLinkActive,
DialogModule,
ProgressSpinnerModule,
ConfirmDialog,
];
@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports: [...components,...modules],
  providers: [JobService,ProfileStoreService]
})
export class SharedModule { }
