import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-companies',
  standalone: false,
  templateUrl: './companies.html',
  styleUrl: './companies.scss'
})
export class Companies implements OnInit, OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  lastSegment: string | null = null;
  sidebarOpen = false;

  ngOnInit() {
    this.updateLastSegment(this.router.url);

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        this.updateLastSegment(e.urlAfterRedirects ?? e.url);
        // Close sidebar on navigation in mobile view
        if (window.innerWidth <= 768) {
          this.sidebarOpen = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Auto-close sidebar when resizing to desktop
    if (event.target.innerWidth > 768 && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }

  private updateLastSegment(url: string) {
    const segments = url.split('/').filter(Boolean);
    this.lastSegment = segments.length ? segments[segments.length - 1] : null;
    console.log('last segment:', this.lastSegment);
  }
}
