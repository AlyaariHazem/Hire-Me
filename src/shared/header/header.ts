import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Logout } from '../services/logout';
import { ToastrService } from 'ngx-toastr';
import { User } from 'app/pages/jobseeker/services/user';
import { ProfileStoreService } from 'shared/services/profile.service';

import { environment } from 'environments/environment';
import { ConfirmationService } from 'primeng/api';
import { UserType } from 'core/types';
import { AuthStateService } from 'app/auth/auth-state.service';
import { AuthService } from 'app/auth/auth.service';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [Logout, ToastrService, ConfirmationService],
})
export class Header implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  // ===== Auth / mode =====
  mode: UserType = 'public';
  private authState = inject(AuthStateService);

  role = computed(() => this.authState.role());
  get token(): boolean {
    return this.authState.isLoggedIn();
  }

  isLoggedIn = computed(() => this.authState.isLoggedIn());


  // ===== Menus state =====
  menuOpen = false;          // jobseeker dropdown
  employerMenuOpen = false;  // employer dropdown
  mobileOpen = false;        // mobile nav
  isEmployerMenuOpen = false;
  changePasswordDialogVisible = false;  // change password dialog
 private profileStore = inject(ProfileStoreService);



  private employerSub?: any;                     // holds employer profile subscription
  private jobseekerSub?: any;                    // holds jobseeker user subscription
  private employerDataBound = false; 

  // ===== Employer info =====
  companyName = () => this.profileStore.profile()?.company_name ?? '';
  
  logoUrl = computed(() => {
    const p = this.profileStore.profile();
    return this.toAbsolute(p?.company_logo ?? p?.profile?.company_logo);
  });

  private toAbsolute(path?: string | null): string {
    if (!path) return '';
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  private destroy$ = new Subject<void>();

  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private userService: User
  ) {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.updateMode(e.urlAfterRedirects || e.url);
        this.closeMobileMenu();
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.companyName = () => this.profileStore.profile()?.company_name ?? '';
  }
  ngAfterViewInit(): void {
    // this.cdr.detectChanges();
  }

  cdr = inject(ChangeDetectorRef);
  logoutService = inject(Logout);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  private confirmationService = inject(ConfirmationService);
  private http = inject(HttpClient);
  
  // Change password form
  changePasswordForm = {
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  };

  ngOnInit(): void {
   if (this.isLoggedIn()) this.profileStore.ensureLoaded();
     this.updateMode(this.router.url);
  }

  routeToJobs(): void {
  if(this.role() === 'employer'){
    this.router.navigate(['/companies/jobs']);
  }
  else if(this.role() === 'jobseeker'){
    this.router.navigate(['/jobseeker/jobs']);
  }
  else{
    this.router.navigate(['/jobs']);
  }
}

  routeToCompanies(): void {
    this.router.navigate(['/companies-list']);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================== Mode logic ==================

  private updateMode(url: string): void {
  if (!this.authState.isLoggedIn()) {
    this.mode = 'public';
    this.teardownDataBindings();
    return;
  }

  // Prefer role over URL guessing
  const r = this.role();
  if (r === 'employer') this.mode = 'employer';
  else this.mode = 'jobseeker';


 
  this.cdr.detectChanges();
}



private teardownDataBindings(): void {
  // unsubscribe and reset flags when going public
  this.employerSub?.unsubscribe();
  this.jobseekerSub?.unsubscribe();
  this.employerSub = this.jobseekerSub = undefined;
  this.employerDataBound = false;
}

  private syncToken = (e: StorageEvent) => {
    debugger;
    if (e.key === 'access') {
      this.updateMode(this.router.url);
    }
  };

  // ================== Common helpers ==================

  notImplemented(): void {
    this.toastr.info('هذه الميزة غير متوفرة حالياً', 'لم يتم التنفيذ');
  }

 logout(): void {
    this.confirmationService.confirm({
      key: 'logout',
      message: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      header: 'تسجيل الخروج',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.logoutService.logout().subscribe({
          next: (res: any) => {
            this.teardownDataBindings();
            this.toastr.success(res?.data?.message ?? 'تم تسجيل الخروج');
            // authService.logout() clears state and navigates to /login
            this.authService.logout();
          },
          error: () => {
            // Even if API call fails, clear local state
            this.teardownDataBindings();
            this.toastr.success('تم تسجيل الخروج');
            // authService.logout() clears state and navigates to /login
            this.authService.logout();
          }
        });
      }
    });
}


  // ================== Desktop menus ==================

  toggleJobseekerMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.employerMenuOpen = false;
  }

  toggleEmployerMenu(evt: MouseEvent): void {
    evt.stopPropagation();
    this.employerMenuOpen = !this.employerMenuOpen;
    this.menuOpen = false;
    this.isEmployerMenuOpen = !this.isEmployerMenuOpen;
  }

  navigate(action: string): void {
    const routes: Record<string, string> = {
      dashboard: '/companies/dashboard',
      profile: '/companies/profile',
      'post-job': '/companies/post-job',
      'employer-settings': '/companies/settings',
      'user-edit': '/companies/user-edit',
    };
    if (action === 'logout') {
      // Use authService.logout() to properly clear all state
      this.authService.logout();
    } else if (routes[action]) {
      this.router.navigate([routes[action]]);
    }
    
    this.isEmployerMenuOpen = false;
  }

  closeMenus(): void {
    this.menuOpen = false;
    this.employerMenuOpen = false;
    this.isEmployerMenuOpen = false;
  }

  navigateEmployer(action: string): void {
    const routes: Record<string, string> = {
      dashboard: '/companies/dashboard',
      profile: '/companies/company-profile',
      'post-job': '/companies/post-job',
      'employer-settings': '/companies/settings',
    };

    if (action === 'logout') {
      // Use authService.logout() to properly clear all state
      this.authService.logout();
    } else if (routes[action]) {
      this.router.navigate([routes[action]]);
    }

    this.employerMenuOpen = false;
  }

  // ================== Mobile menu ==================

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
    document.body.classList.toggle('no-scroll', this.mobileOpen);
  }

  closeMobileMenu(): void {
    if (this.mobileOpen) {
      this.mobileOpen = false;
      document.body.classList.remove('no-scroll');
    }
  }

  // ================== Global listeners ==================

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    // Close dropdowns (jobseeker/employer) on outside click
    if (this.menuRoot?.nativeElement &&
      !this.menuRoot.nativeElement.contains(target)) {
      this.closeMenus();
    }

    // Close mobile menu when clicking outside navbar/toggle
    if (this.mobileOpen) {
      const insideNavbar = target.closest('.navbar');
      const toggleBtn = target.closest('.mobile-menu-toggle');
      if (!insideNavbar && !toggleBtn) this.closeMobileMenu();
    }
    this.isEmployerMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    this.closeMobileMenu();
    this.closeMenus();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.mobileOpen) {
      this.closeMobileMenu();
    }
  }

  handleLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'images/HireMe.png';
    }
  }

  // ================== Change Password Dialog ==================

  openChangePasswordDialog(): void {
    this.changePasswordDialogVisible = true;
    this.closeMenus();
    this.closeMobileMenu();
  }

  closeChangePasswordDialog(): void {
    this.changePasswordDialogVisible = false;
    // Reset form
    this.changePasswordForm = {
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    };
  }

  changePassword(): void {
    if (this.changePasswordForm.new_password !== this.changePasswordForm.new_password_confirm) {
      this.toastr.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    this.http.post(environment.getUrl('change-password', 'accounts'), this.changePasswordForm)
      .subscribe({
        next: (res: any) => {
          // per your docs: "new token returned"
          if (res?.access) {
            localStorage.setItem('access', res.access);
            this.authState.setAuth(res.access, this.role());
          }
          if (res?.refresh) localStorage.setItem('refresh', res.refresh);

          this.toastr.success('تم تغيير كلمة المرور بنجاح');
          this.closeChangePasswordDialog();
        },
        error: (err) => {
          const msg = err?.error ? Object.values(err.error).flat().join(' | ') : 'فشل تغيير كلمة المرور';
          this.toastr.error(msg);
          console.error(err);
        }
      });
  }
}
