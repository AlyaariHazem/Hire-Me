import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProfileStoreService } from 'shared/services/profile.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-cv',
  standalone: false,
  templateUrl: './cv.html',
  styleUrl: './cv.scss'
})
export class CV implements OnInit, OnDestroy {
  private store = inject(ProfileStoreService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  resumeUrl: string | null = null;
  resumeDisplayName: string = 'السيرة الذاتية';
  hasResume = false;
  isLoading = true;

  ngOnInit(): void {
    this.store.ensureLoaded();
    this.store.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is any => !!p)
      )
      .subscribe((profile) => {
        const resume = profile.resume;
        this.hasResume = !!resume;
        if (resume) {
          this.resumeUrl = this.toAbsolute(resume);
          try {
            this.resumeDisplayName = decodeURIComponent(resume.split('/').pop() || 'السيرة الذاتية');
          } catch {
            this.resumeDisplayName = 'السيرة الذاتية';
          }
        } else {
          this.resumeUrl = null;
          this.resumeDisplayName = 'السيرة الذاتية';
        }
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private toAbsolute(path?: string | null): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  navigateToProfile(): void {
    this.router.navigate(['/jobseeker/profile']);
  }

  navigateToBuilder(): void {
    this.router.navigate(['/jobseeker/cv-builder']);
  }

  downloadResume(): void {
    if (this.resumeUrl) {
      window.open(this.resumeUrl, '_blank');
    }
  }

  previewResume(): void {
    if (this.resumeUrl) {
      window.open(this.resumeUrl, '_blank');
    }
  }
}
