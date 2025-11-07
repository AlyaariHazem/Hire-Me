import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Errors } from '../../../../shared/services/errors';
import { ProfileService } from '../core/services/profile.service';
// (optional) if you use the NO_SPINNER token from your interceptor:
// import { NO_SPINNER } from '../../core/interceptors/auth.interceptor';

@Component({
  selector: 'app-company-data',
  standalone: false,
  templateUrl: './company-data.html',
  styleUrls: ['./company-data.scss'],
})
export class CompanyData {

  errors = inject(Errors);
  saving = false;
  logoFile?: File;
  logo$: any;

  form: any = {
    company_name: '',
    company_description: '',
    company_logo: '', // if backend accepts URL/string
    company_website: '',
    company_size: '',
    industry: '',
    founded_year: null, // number (e.g., 2015)
  };

  constructor(private http: HttpClient, private toastr: ToastrService, private profileService: ProfileService) {
    this.logo$ = this.profileService.getProfile$().pipe(
      map(p => environment.apiBaseUrl + p.company_logo),
    );
    this.profileService.getProfile$().subscribe(p =>{
      this.form = p;
    });
  }

  onLogoSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.logoFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => (this.logo$ = reader.result as string);
    reader.readAsDataURL(file);
  }

  save() {
  this.saving = true;
  const url = environment.getUrl('profile/employer', 'accounts');

  const fd = new FormData();
  // حقول نصية
  fd.append('company_name', this.form.company_name ?? '');
  fd.append('company_description', this.form.company_description ?? '');
  fd.append('company_website', this.form.company_website ?? '');
  fd.append('company_size', this.form.company_size ?? '');
  fd.append('industry', this.form.industry ?? '');
  if (this.form.founded_year != null && this.form.founded_year !== '') {
    fd.append('founded_year', String(+this.form.founded_year));
  }

  // لا تُرسل company_logo إلا إذا كان ملفًا فعلاً
  if (this.logoFile) {
    fd.append('company_logo', this.logoFile); // ✅ ملف صحيح
  }
  // ملاحظة: إذا أردت إرسال إشارة للاحتفاظ بالشعار القديم:
  // else { fd.append('keep_logo', 'true'); } // فقط إذا الـ API يدعم ذلك

  this.http.put(url, fd).subscribe({
    next: () => {
      this.toastr.success('تم حفظ بيانات الشركة بنجاح');
      this.saving = false;
    },
    error: (err) => {
      this.errors.error(err, { join: true });
      this.saving = false;
    }
  });
}


}
