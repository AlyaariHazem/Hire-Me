import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header-company',
  standalone: false,
  templateUrl: './header-company.html',
  styleUrls: ['./header-company.scss'],
})
export class HeaderCompany implements OnInit {
  isEmployerMenuOpen = false;

  constructor(private el: ElementRef, private http: HttpClient, private router: Router, private toastr: ToastrService) {}
  logo:string = '';
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

    ngOnInit() {
      this.getProfileData();
    }

    getProfileData() {
      const url = environment.getUrl('profile', 'accounts');
      this.http.get(url).subscribe({
        next: (data:any) => {
          debugger;
          const Logo = data.data.profile.company_logo;
          this.logo = environment.apiBaseUrl + Logo;
        },
        error: (err) => {
          this.toastr.error('فشل في تحميل بيانات الشركة');
          console.error(err);
        }
      });
    }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(evt: Event): void {
    if (!this.el.nativeElement.contains(evt.target)) {
      this.isEmployerMenuOpen = false;
    }
  }
}
