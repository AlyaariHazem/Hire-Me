import {
  Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject
} from '@angular/core';
import { Router } from '@angular/router';
import { Logout } from '../services/logout';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../app/pages/jobseeker/services/user';
import { environment } from '../../environments/environment.development';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [Logout, ToastrService, User],
})
export class Header implements OnInit, OnDestroy {
  token = !!localStorage.getItem('access');
  menuOpen = false;

  absoluteAvatar: string | null = null;
  firstName: string | null = null;

  private destroy$ = new Subject<void>();

  @ViewChild('menuRoot', { static: false }) menuRoot?: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private userService: User,                 // ← جلب بيانات المستخدم من الباكإند
  ) {
    this.userService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        const rel = data?.data?.user?.profile_picture;
        this.absoluteAvatar = this.toAbsolute(rel);
        this.firstName = data?.data?.user?.first_name;
      });
  }

  logoutService = inject(Logout);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    window.addEventListener('storage', this.syncToken);
    localStorage.removeItem('access');
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.syncToken);
    this.destroy$.next(); this.destroy$.complete();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!this.menuRoot?.nativeElement.contains(e.target as Node)) this.closeMenu();
  }

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
      this.toastr.success(res.data.message);
      this.router.navigate(['/login']);
      localStorage.removeItem('access');
    });
  }
}
