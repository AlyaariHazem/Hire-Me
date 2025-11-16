import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'environments/environment';
import { ProfileStoreService } from 'shared/services/profile.service';

@Component({
  selector: 'app-header-company',
  standalone: false,
  templateUrl: './header-company.html',
  styleUrls: ['./header-company.scss'],
})
export class HeaderCompany {
  isEmployerMenuOpen = false;
  companyName:string = 'شركة التقنية المتقدمة';
  toastr = inject(ToastrService);
  private el = inject(ElementRef);
  private router = inject(Router);
  private profileStore = inject(ProfileStoreService);

  // ✅ logo$ now comes from the shared store
  logo$ = this.profileStore.getProfile$().pipe(
    filter((p): p is any => !!p),
    map(p =>
      p.company_logo
        ? environment.apiBaseUrl + p.company_logo
        : 'assets/images/default-logo.svg' // fallback if you like
    )
  );
  ngOnInit() {
     this.profileStore.getProfile$().subscribe(
      (p:any) => {
        this.companyName = p.company_name;
      }
    );
  }
  

  notImplemented() {
    this.toastr.info('هذه الميزة غير متوفرة حالياً', 'لم يتم التنفيذ');
  }

  toggleEmployerMenu(evt: MouseEvent): void {
    evt.stopPropagation();
    this.isEmployerMenuOpen = !this.isEmployerMenuOpen;
  }

  navigate(action: string): void {
    const routes: Record<string, string> = {
      dashboard: '/companies/dashboard',
      profile: '/companies/company-profile',
      'post-job': '/companies/post-job',
      'employer-settings': '/companies/settings',
    };

    if (action === 'logout') {
      localStorage.removeItem('access');
      this.router.navigate(['/login']);
    } else if (routes[action]) {
      this.router.navigate([routes[action]]);
    }

    this.isEmployerMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(evt: Event): void {
    if (!this.el.nativeElement.contains(evt.target)) {
      this.isEmployerMenuOpen = false;
    }
  }
}
