import {
  ChangeDetectorRef,
  Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Logout } from '../services/logout';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../app/pages/jobseeker/services/user';
import { environment } from '../../environments/environment.development';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [Logout, ToastrService, User],
})
export class Header implements OnInit, OnDestroy {
  token = !!localStorage.getItem('access');

  // user dropdown (desktop)
  menuOpen = false;

  // mobile menu state
  mobileOpen = false;

  absoluteAvatar: string | null = null;
  firstName: string | null = null;

  private destroy$ = new Subject<void>();

  // refs
  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;
  @ViewChild('navbarEl', { static: false }) navbarEl?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private userService: User,
  ) {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const rel = data?.data?.user?.profile_picture;
        this.absoluteAvatar = this.toAbsolute(rel);
        this.firstName = data?.data?.user?.first_name;
      });

    // close mobile menu whenever we navigate
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMobileMenu());
  }

  cdr = inject(ChangeDetectorRef);
  logoutService = inject(Logout);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    window.addEventListener('storage', this.syncToken);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next(); this.destroy$.complete();
  }

  // ===== Desktop user menu =====
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    // close desktop user menu when clicking outside it
    if (this.menuRoot?.nativeElement && !this.menuRoot.nativeElement.contains(e.target as Node)) {
      this.closeMenu();
    }

    // close mobile menu if click outside navbar & toggle button
    if (this.mobileOpen) {
      const target = e.target as HTMLElement;
      const insideNavbar = target.closest('.navbar');
      const toggleBtn = target.closest('.mobile-menu-toggle');
      if (!insideNavbar && !toggleBtn) this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeMobileMenu(); this.closeMenu(); }

  private syncToken = (e: StorageEvent) => {
    if (e.key === 'access') this.token = !!e.newValue;
  };

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
      this.toastr.success(res?.data?.message ?? 'تم تسجيل الخروج');
      localStorage.removeItem('access');
      this.router.navigate(['/login']);
      this.cdr.detectChanges();
    });
  }

  // ===== Mobile menu =====
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

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768 && this.mobileOpen) {
      this.closeMobileMenu();
    }
  }
}
