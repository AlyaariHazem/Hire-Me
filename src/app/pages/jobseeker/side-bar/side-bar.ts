import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from 'shared/shared-module';

@Component({
  selector: 'app-side-bar',
  imports: [SharedModule],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar implements OnInit, OnDestroy {
  // English: form holder (if you need later inputs)
  basicForm!: FormGroup;
  baseUrl = environment.apiBaseUrl;

  // English: company profile snapshot
  profile: Profile | null = null;

  // English: logo preview (absolute URL or blob url)
  logo$ = signal<string | null>(null);
  previewUrl: string | null = null;
  private isBlobPreview = false;

  // English: company name display
  jobSeekerName = 'المستخدم';
  
  // English: job seeker title/profession
  jobSeekerTitle = '';

  // English: local image selection state
  selectedFile: File | null = null;
  saving = false;

  private destroy$ = new Subject<void>();

  // English: shared profile store (single source of truth)
  private profileStore = inject(ProfileStoreService);

  // English: http for PUT call to update company logo
  private http = inject(HttpClient);

  // English: notifications
  private toast = inject(ToastrService);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // English: init simple form (kept for future fields)
    this.basicForm = this.fb.group({ company_logo: [''] });

    // English: trigger initial load (safe to call multiple times)
    this.profileStore.ensureLoaded();

    // English: subscribe to shared profile and reflect on UI
    this.profileStore.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is Profile => !!p)
      )
      .subscribe((p) => {
        this.profile = p;
        this.jobSeekerName = p.user.first_name + ' ' + p.user.last_name || this.jobSeekerName;
        
        // English: get job title from profile - check multiple possible fields
        // Try job_seeker.title, bio, or any other title field
        this.jobSeekerTitle = (p as any).job_seeker?.title || 
                              (p as any).job_seeker?.profession || 
                              (p as any).title || 
                              (p as any).profession || 
                              (p as any).bio || 
                              (p as any).user?.bio || 
                              '';
        
        // English: prefer nested profile.company_logo, then root company_logo
        const logoPath = p.profile?.company_logo || p.user.profile_picture || null;
        this.previewUrl = this.toAbsolute(logoPath);
        this.logo$.set(this.previewUrl);
        this.isBlobPreview = false; // English: backend URL, not blob
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.previewUrl && this.isBlobPreview) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }

  // ================= Image selection / preview =================

  onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile = file;

    if (this.previewUrl && this.isBlobPreview) {
      URL.revokeObjectURL(this.previewUrl);
    }

    if (file) {
      // English: use local blob preview until saved
      this.previewUrl = URL.createObjectURL(file);
      this.logo$.set(this.previewUrl);
      this.isBlobPreview = true;
    } else {
      // English: reset to stored logo from profile (if any)
      const logoPath =
        this.profile?.profile?.company_logo || this.profile?.user?.profile_picture || null;
      this.previewUrl = this.toAbsolute(logoPath);
      this.logo$.set(this.previewUrl);
      this.isBlobPreview = false;
    }
  }

  cancelAvatar() {
    if (this.previewUrl && this.isBlobPreview) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.selectedFile = null;

    // English: restore original logo from profile
    const logoPath =
      this.profile?.profile?.company_logo || this.profile?.user?.profile_picture || null;
    this.previewUrl = this.toAbsolute(logoPath);
    this.logo$.set(this.previewUrl);
    this.isBlobPreview = false;
  }

  // ================= Save company logo via employer profile =================

  saveAvatar() {
    if (!this.selectedFile) return;

    // English: build multipart body for employer profile update
    const fd = new FormData();
    fd.append('profile_picture', this.selectedFile);

    this.saving = true;
    const url = environment.getUrl('profile/update', 'accounts');

    this.http.put(url, fd).subscribe({
      next: () => {
        // English: keep current preview as the logo
        this.logo$.set(this.previewUrl);
        this.selectedFile = null;
        this.saving = false;
        this.toast.success('تم تحديث صورة الملف الشخصي');

        // English: refresh shared profile so all app updates
        this.profileStore.refresh();
      },
      error: () => {
        this.saving = false;
        this.toast.error('فشل تحديث صورة الملف الشخصي');
      },
    });
  }

  // ================= Utils =================

  // English: normalize relative logo path to absolute API URL
  toAbsolute(path?: string | null): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }
}
