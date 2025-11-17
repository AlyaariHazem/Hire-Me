import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Subject, takeUntil } from 'rxjs';

import { Logout } from '../services/logout';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../app/pages/jobseeker/services/user';
import { ProfileStoreService } from 'shared/services/profile.service';

import { environment } from 'environments/environment';
import { UserType } from 'core/types';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [Logout, ToastrService, User],
})
export class Header implements OnInit, OnDestroy {
  // ===== Auth / mode =====
  mode: UserType = 'public';
  token = !!localStorage.getItem('access');

  // ===== Menus state =====
  menuOpen = false;          // jobseeker dropdown
  employerMenuOpen = false;  // employer dropdown
  mobileOpen = false;        // mobile nav
  isEmployerMenuOpen = false;
 private profileStore = inject(ProfileStoreService);

  // ===== Jobseeker user info =====
  jobseekerAvatar: string | null = null;
  jobseekerFirstName: string | null = null;

  private employerSub?: any;                     // holds employer profile subscription
  private jobseekerSub?: any;                    // holds jobseeker user subscription
  private employerDataBound = false; 

  // ===== Employer info =====
  companyName = 'شركة التقنية المتقدمة';
  logo$ = this.profileStore.profile$.pipe(
    filter((p): p is any => !!p),
    map(p => p.profile.company_logo ? environment.apiBaseUrl + p.profile.company_logo : 'assets/images/default-logo.svg')
  );

  private destroy$ = new Subject<void>();

  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private userService: User
  ) {
    // Jobseeker user data
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const rel = data?.data?.user?.profile_picture;
        this.jobseekerAvatar = this.toAbsolute(rel);
        this.jobseekerFirstName = data?.data?.user?.first_name;
      });

      // this.profileStore.ensureLoaded();

    // Employer profile data
    this.profileStore.profile$.subscribe(p => {
      if (p) this.companyName = p.company_name;
    });

    // Update mode when navigating
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.updateMode(e.urlAfterRedirects || e.url);
        this.closeMobileMenu();
      });
  }

  cdr = inject(ChangeDetectorRef);
  logoutService = inject(Logout);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    window.addEventListener('storage', this.syncToken);
    this.updateMode(this.router.url);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================== Mode logic ==================

  private updateMode(url: string): void {
  this.token = !!localStorage.getItem('access');

  if (!this.token) {
    this.mode = 'public';
    this.teardownDataBindings();               // stop any running bindings
    return;
  }

  this.mode = url.startsWith('/companies') ? 'employer' : 'jobseeker';

  // bind data per mode once
  if (this.mode === 'employer' && !this.employerDataBound) {
    // Load employer profile once (will no-op if already loaded inside store)
    // this.profileStore.ensureLoaded();          // <-- triggers fetch only once in store
    this.employerSub = this.profileStore.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(p => { if (p) this.companyName = p.company_name; });

    this.employerDataBound = true;
  }

  if (this.mode === 'jobseeker' && !this.jobseekerSub) {
    this.jobseekerSub = this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const rel = data?.data?.user?.profile_picture;
        this.jobseekerAvatar = this.toAbsolute(rel);
        this.jobseekerFirstName = data?.data?.user?.first_name;
      });
  }
}

private teardownDataBindings(): void {
  // unsubscribe and reset flags when going public
  this.employerSub?.unsubscribe();
  this.jobseekerSub?.unsubscribe();
  this.employerSub = this.jobseekerSub = undefined;
  this.employerDataBound = false;
}

  private syncToken = (e: StorageEvent) => {
    if (e.key === 'access') {
      this.token = !!e.newValue;
      this.updateMode(this.router.url);
    }
  };

  // ================== Common helpers ==================

  notImplemented(): void {
    this.toastr.info('هذه الميزة غير متوفرة حالياً', 'لم يتم التنفيذ');
  }

  private toAbsolute(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  logout(): void {
  this.logoutService.logout().subscribe((res: any) => {
    this.token = false;
    this.mode = 'public';
    localStorage.removeItem('access');
    this.profileStore.reset();
    this.teardownDataBindings();
    this.router.navigate(['/login']);
    this.toastr.success(res?.data?.message ?? 'تم تسجيل الخروج');
    this.cdr.detectChanges();
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
      localStorage.removeItem('access');
      this.token = false;
      this.mode = 'public';
      this.router.navigate(['/login']);
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
}
