import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-companies',
  standalone: false,
  templateUrl: './companies.html',
  styleUrl: './companies.scss'
})
export class Companies {
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  lastSegment: string | null = null;

  ngOnInit() {
    this.updateLastSegment(this.router.url);

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        this.updateLastSegment(e.urlAfterRedirects ?? e.url);
      });
  }

  private updateLastSegment(url: string) {
    const segments = url.split('/').filter(Boolean);
    this.lastSegment = segments.length ? segments[segments.length - 1] : null;
    console.log('last segment:', this.lastSegment);
  }
}
