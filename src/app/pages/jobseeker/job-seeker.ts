import { Component, OnDestroy, inject } from '@angular/core';
import { Profile, ProfileStoreService } from 'shared/services/profile.service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-job-seeker',
  standalone: false,
  templateUrl: './job-seeker.html',
  styleUrl: './job-seeker.scss'
})
export class JobSeeker implements OnDestroy {
  // English: yes, this will actually hold employer profile, not jobseeker
  userData: Profile | null = null;

  private destroy$ = new Subject<void>();
  private profileStore = inject(ProfileStoreService);

  ngOnInit() {
    // English: make sure profile is loaded once (idempotent)
    // this.profileStore.ensureLoaded();

    // English: bind to shared profile and keep it typed
    this.profileStore.profile$
      .pipe(
        filter((p): p is Profile => !!p),
        takeUntil(this.destroy$)
      )
      .subscribe(p => {
        this.userData = p;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
