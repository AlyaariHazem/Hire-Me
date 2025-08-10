import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
export class CompanyData {
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

  save() {
  // ...validation...

  this.saving = true;
  const url = environment.getUrl('profile/employer', 'accounts');

  let req$: Observable<any>;

  if (this.logoFile) {
    const fd = new FormData();
    fd.append('company_name', this.form.company_name || '');
    fd.append('company_description', this.form.company_description || '');
    fd.append('company_website', this.form.company_website || '');
    fd.append('company_size', this.form.company_size || '');
    fd.append('industry', this.form.industry || '');
    if (this.form.founded_year != null) {
      // ensure it's an integer year
      fd.append('founded_year', String(+this.form.founded_year));
    }
    fd.append('company_logo', this.logoFile);

    req$ = this.http.put(url, fd /*, { context: new HttpContext().set(NO_SPINNER, false) }*/);
  } else {
    const body = {
      company_name: this.form.company_name || '',
      company_description: this.form.company_description || '',
      company_logo: this.form.company_logo || '',
      company_website: this.form.company_website || '',
      company_size: this.form.company_size || '',
      industry: this.form.industry || '',
      founded_year: this.form.founded_year != null ? +this.form.founded_year : null,
    };

    req$ = this.http.put(url, body /*, { context: new HttpContext().set(NO_SPINNER, false) }*/);
  }

  req$.subscribe({
    next: () => {
      this.toastr.success('تم حفظ بيانات الشركة بنجاح');
      this.saving = false;
    },
    error: (err) => {
      const msg = err?.error ? Object.values(err.error).flat().join(' | ') : 'فشل تحديث بيانات الشركة';
      this.toastr.error(msg);
      console.error(err);
      this.saving = false;
    }
  });
}

}
