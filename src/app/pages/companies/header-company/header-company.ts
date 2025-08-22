import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-header-company',
  standalone: false,
  templateUrl: './header-company.html',
  styleUrls: ['./header-company.scss'],
})
export class HeaderCompany {
  isEmployerMenuOpen = false;
  logo$: any;
  constructor(private el: ElementRef, private router: Router, private profileService: ProfileService) {
    this.logo$ = this.profileService.getProfile$().pipe(
      map(p => environment.apiBaseUrl + p.company_logo)
    );
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
      // this.authService.logout();
      this.router.navigate(['/login']);
      localStorage.removeItem('access');
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
