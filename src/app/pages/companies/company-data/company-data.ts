import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
// (optional) if you use the NO_SPINNER token from your interceptor:
// import { NO_SPINNER } from '../../core/interceptors/auth.interceptor';

@Component({
  selector: 'app-company-data',
  standalone: false,
  templateUrl: './company-data.html',
  styleUrls: ['./company-data.scss'],
})
export class CompanyData implements OnInit {
  ngOnInit() {
    this.getProfileData();
  }

  saving = false;
  logoFile?: File;
  logoPreview: string | null = null;

  form: any = {
    company_name: '',
    company_description: '',
    company_logo: '', // if backend accepts URL/string
    company_website: '',
    company_size: '',
    industry: '',
    founded_year: null, // number (e.g., 2015)
  };

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  onLogoSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.logoFile = file;

    // preview
    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }
  getProfileData() {
    const url = environment.getUrl('profile', 'accounts');
    this.http.get(url).subscribe({
      next: (data:any) => {
        debugger;
        this.form = data.data.profile;
      },
      error: (err) => {
        this.toastr.error('فشل في تحميل بيانات الشركة');
        console.error(err);
      }
    });
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
      const msg = err?.error ? Object.values(err.error).flat().join(' | ')
                              : 'فشل تحديث بيانات الشركة';
      this.toastr.error(msg);
      console.error(err);
      this.saving = false;
    }
  });
}


}
