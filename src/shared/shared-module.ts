import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Header } from './header/header';
import { Messages } from './messages/messages';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { JobService } from './services/job.service';
import { ProfileStoreService } from './services/profile.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

const components = [
Header,
Footer,

ProgressSpinnerComponent,
BreadcrumbComponent
];

const modules = [
CommonModule,
RouterModule,
RouterLink,
FormsModule,
Messages,
RouterLinkActive,
DialogModule,
ProgressSpinnerModule,
ConfirmDialog,
BreadcrumbModule,
];
@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports: [...components,...modules],
  providers: [JobService, ProfileStoreService, BreadcrumbService]
})
export class SharedModule { }
