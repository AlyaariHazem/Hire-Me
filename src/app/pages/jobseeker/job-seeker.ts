import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-seeker',
  standalone: false,
  templateUrl: './job-seeker.html',
  styleUrl: './job-seeker.scss'
})
export class JobSeeker implements OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  lastSegment: string | null = null;

  ngOnInit() {
    // Initial value
    this.updateLastSegment(this.router.url);

    // If you want it to react when child route changes without destroying this component
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
