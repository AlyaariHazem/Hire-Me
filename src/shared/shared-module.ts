import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './footer/footer';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Header } from './header/header';
import { Messages } from './messages/messages';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
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
ConfirmDialogModule,
ButtonModule,
BreadcrumbModule,
AvatarModule,
MenuModule,
RippleModule,
DividerModule,
InputTextModule,
];
@NgModule({
  declarations: [...components],
  imports: [
    ...modules
  ],
  exports: [...components,...modules],
  providers: [BreadcrumbService]
})
export class SharedModule { }
