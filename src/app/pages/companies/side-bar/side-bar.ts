import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { environment } from 'environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';
import { SidebarStoreService } from '../services/sidebar.store';
import { SharedModule } from 'shared/shared-module';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-side-bar-company',
  imports: [
    SharedModule,
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    AvatarModule,
    DividerModule,
    MenuModule,
    RippleModule,
    TagModule,
    SkeletonModule
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBarCompany implements OnInit {
  // English: reactive logo preview (absolute URL)
  logo = signal<string>('');
  // English: default company name until profile loads
  companyName = 'شركة التقنيات المتقدمة';
  industry = 'IT';

  private profileStore = inject(ProfileStoreService);
  private sidebarStore = inject(SidebarStoreService);

  // Stats signals
  activeJobsCount = this.sidebarStore.activeJobsCount;
  newApplicantsCount = this.sidebarStore.newApplicantsCount;
  loading = this.sidebarStore.loading;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // English: trigger initial load once (safe to call many times)
     this.profileStore.ensureLoaded(); // English: harmless repeated call
     this.sidebarStore.init();
     
  this.profileStore.profile$
    .pipe(filter((p): p is Profile => !!p))
    .subscribe(p => {
      console.log('hazemm',p);
      this.companyName = p.company_name ?? this.companyName;
      this.logo.set(this.toAbsolute(p.company_logo));
      this.industry = p.industry ?? this.industry;
    });
  }

  // English: normalize relative path to absolute API URL
  private toAbsolute(path?: string | null): string {
    if (!path) return '';
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  handleImageError(event: any): void {
    // Handle PrimeNG Avatar image error
    // The avatar will automatically fallback to label if image fails
    console.warn('Company logo failed to load, using placeholder');
  }

  getCompanyInitials(): string {
    if (!this.companyName || this.companyName === 'شركة التقنيات المتقدمة') {
      return 'شركة';
    }
    const words = this.companyName.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return this.companyName.charAt(0).toUpperCase();
  }
}
