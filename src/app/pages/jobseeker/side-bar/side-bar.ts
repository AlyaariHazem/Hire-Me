import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { filter, Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar implements OnInit, OnDestroy {
  // English: form holder (if you need later inputs)
  basicForm!: FormGroup;

  // English: company profile snapshot
  profile: any | null = null;

  // English: logo preview (absolute URL). Using signal so template updates instantly.
  logo$ = signal<string | null>(null);

  // English: company name display
  companyName = 'شركة التقنيات المتقدمة';

  // English: local image selection and preview handling
  selectedFile: File | null = null;
  previewUrl: string | null = null;
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
    // English: init dumb form (kept for future fields)
    this.basicForm = this.fb.group({ company_logo: [''] });

    // English: trigger initial load (safe to call multiple times)
    this.profileStore.ensureLoaded();

    // English: subscribe to shared profile and reflect on UI
    this.profileStore.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is Profile => !!p)
      )
      .subscribe(p => {
        this.profile = p;
        this.companyName = p.company_name ?? this.companyName;
        this.logo$.set(this.toAbsolute(p.company_logo));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  // ================= Image selection / preview =================

  onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile = file;

    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  cancelAvatar() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.selectedFile = null;
  }

  // ================= Save company logo via employer profile =================

  saveAvatar() {
    if (!this.selectedFile) return;

    // English: build multipart body for employer profile update
    const fd = new FormData();
    fd.append('company_logo', this.selectedFile);

    this.saving = true;
    const url = environment.getUrl('profile/employer', 'accounts');

    this.http.put(url, fd).subscribe({
      next: () => {
        // English: instant UI feedback with local preview
        this.logo$.set(this.previewUrl);
        this.selectedFile = null;
        this.previewUrl = null;
        this.saving = false;
        this.toast.success('تم تحديث شعار الشركة');

        // English: refresh shared profile so all app updates
        this.profileStore.refresh();
      },
      error: () => {
        this.saving = false;
        this.toast.error('فشل تحديث الشعار');
      }
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
