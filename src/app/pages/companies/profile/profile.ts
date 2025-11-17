import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, filter } from 'rxjs';

import { environment } from 'environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';
import { Errors } from 'shared/services/errors';
import { ProfileService } from '../core/services/profile.service';
import { COMPANY_SIZES } from '@app/companies/enums';

@Component({
  selector: 'app-company-data',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  COMPANY_SIZES = COMPANY_SIZES;
  errors = inject(Errors);
  saving = false;

  // English: selected logo file and preview URL
  logoFile?: File;
  logo$?: string | null;

  profileStore = inject(ProfileStoreService);

  // English: keep a typed, minimal form model
  form: {
    company_name: string;
    company_description: string;
    company_logo: string;
    company_website: string;
    company_size: string;
    industry: string;
    founded_year: number | null;
  } = {
    company_name: '',
    company_description: '',
    company_logo: '',
    company_website: '',
    company_size: '',
    industry: '',
    founded_year: null,
  };

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private profileService: ProfileService // keep if used elsewhere
  ) {}

  ngOnInit(): void {
    // English: trigger initial load once (safe to call multiple times)
    // this.profileStore.ensureLoaded();

    // English: bind to shared profile stream (typed via type guard)
    this.profileStore.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is Profile => !!p)
      )
      .subscribe((p) => {
        // English: build absolute logo preview
        this.logo$ = p.company_logo ? this.toAbsolute(p.company_logo) : null;
        debugger;
        // English: patch values without replacing the reference
        this.form.company_name = p.company_name ?? '';
        this.form.company_description = (p as any).company_description ?? '';
        this.form.company_logo = p.company_logo ?? '';
        this.form.company_website = (p as any).company_website ?? '';
        this.form.company_size = (p as any).company_size ?? '';
        this.form.industry = (p as any).industry ?? '';
        this.form.founded_year = (p as any).founded_year ?? null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // English: convert relative path to absolute based on API base URL
  private toAbsolute(path: string): string {
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  onLogoSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.logoFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.logo$ = reader.result as string);
    reader.readAsDataURL(file);
  }

  save() {
    this.saving = true;
    const url = environment.getUrl('profile/employer', 'accounts');

    // English: build multipart form data
    const fd = new FormData();
    fd.append('company_name', this.form.company_name ?? '');
    fd.append('company_description', this.form.company_description ?? '');
    fd.append('company_website', this.form.company_website ?? '');
    fd.append('company_size', this.form.company_size ?? '');
    fd.append('industry', this.form.industry ?? '');

    if (this.form.founded_year != null && this.form.founded_year !== ('' as any)) {
      fd.append('founded_year', String(+this.form.founded_year));
    }

    if (this.logoFile) {
      fd.append('company_logo', this.logoFile);
    }

    this.http.put(url, fd).subscribe({
      next: () => {
        this.toastr.success('تم حفظ بيانات الشركة بنجاح');
        this.saving = false;
        // English: refresh the shared cache so all components see the update
        this.profileStore.refresh();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.saving = false;
      },
    });
  }
}
