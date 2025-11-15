import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, filter } from 'rxjs';

import { environment } from 'environments/environment';
import { ProfileStoreService } from 'shared/services/profile.service';
import { Errors } from 'shared/services/errors';
import { ProfileService } from '../core/services/profile.service';
import { COMPANY_SIZES } from '@app/companies/enums';

@Component({
  selector: 'app-company-data',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  COMPANY_SIZES = COMPANY_SIZES;
  errors = inject(Errors);
  saving = false;
  logoFile?: File;
  logo$?: string | null;

  profileStore = inject(ProfileStoreService);

  form: any = {
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
    private profileService: ProfileService // if you still need it elsewhere
  ) {}

  ngOnInit(): void {
    // 🔹 Load profile from the store (store will call backend once)
    this.profileStore
      .getProfile$() // no force → only fetch if not loaded
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is any => !!p) // ignore null/undefined
      )
      .subscribe((p) => {
        // backend returns relative path? adjust if needed
        this.logo$ = p.company_logo
          ? environment.apiBaseUrl + p.company_logo
          : null;

        this.form = {
          ...this.form,
          ...p,
          founded_year: p.founded_year ?? null,
        };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const fd = new FormData();
    fd.append('company_name', this.form.company_name ?? '');
    fd.append('company_description', this.form.company_description ?? '');
    fd.append('company_website', this.form.company_website ?? '');
    fd.append('company_size', this.form.company_size ?? '');
    fd.append('industry', this.form.industry ?? '');

    if (this.form.founded_year != null && this.form.founded_year !== '') {
      fd.append('founded_year', String(+this.form.founded_year));
    }

    if (this.logoFile) {
      fd.append('company_logo', this.logoFile);
    }

    this.http.put(url, fd).subscribe({
      next: () => {
        this.toastr.success('تم حفظ بيانات الشركة بنجاح');
        this.saving = false;

        // 🔹 Very important: refresh the store so all app gets latest profile
        this.profileStore.refreshProfile();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.saving = false;
      },
    });
  }
}
