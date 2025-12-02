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

import { Logout } from '../services/logout';
import { ToastrService } from 'ngx-toastr';
import { User } from 'app/pages/jobseeker/services/user';
import { ProfileStoreService } from 'shared/services/profile.service';

import { environment } from 'environments/environment';
import { UserType } from 'core/types';
import { AuthStateService } from 'app/auth/auth-state.service';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [Logout, ToastrService],
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
 private profileStore = inject(ProfileStoreService);



  private employerSub?: any;                     // holds employer profile subscription
  private jobseekerSub?: any;                    // holds jobseeker user subscription
  private employerDataBound = false; 

  // ===== Employer info =====
  companyName = () => this.profileStore.profile()?.company_name ?? '';
  logoUrl = () => this.profileStore.profile()?.profile?.company_logo ?? '';

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
  toastr = inject(ToastrService);

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

  private toAbsolute(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

 logout(): void {
  this.logoutService.logout().subscribe((res: any) => {
    this.authState.clear();
    this.profileStore.reset();
    this.teardownDataBindings();
    this.router.navigate(['/login']);
    this.toastr.success(res?.data?.message ?? 'تم تسجيل الخروج');
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
    };
    if (action === 'logout') {
      localStorage.removeItem('access');
      localStorage.removeItem('role');
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
      this.authState.clear();
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
