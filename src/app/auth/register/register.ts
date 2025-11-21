import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { CompanyService } from 'app/pages/companies/core/services/company.service';
import { Base } from 'shared/base/base';


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register extends Base {
  user = true;      // job seeker default
  admin = false;    // employer
  companyService = inject(CompanyService);

  // Bind to template
  model = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    super();
  }

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = !this.user;
  }

  register(f: NgForm) {
    // username: usually email (or generate one). Using email keeps it simple.
    if (f.invalid) {
      // علّم جميع الحقول كـ touched ليظهر التنبيه فورًا
      Object.values(f.controls).forEach(ctrl => {
        ctrl.markAsTouched();
        ctrl.updateValueAndValidity();
      });
      // رسالة عامة
      this.toastr.error('فضلاً صحّح الأخطاء ثم أعد المحاولة');
      return;
    }

    // تحقّق إضافي للهاتف (احتياطًا)
    if (!/^7[0-9]{8}$/.test(this.model.phone)) {
      this.toastr.error('رقم الهاتف يجب أن يبدأ بـ 7 ويتكون من 9 أرقام');
      return;
    }
    const payload = {
      username: this.model.email,
      email: this.model.email,
      first_name: this.model.first_name,
      last_name: this.model.last_name,
      password: this.model.password,
      password_confirm: this.model.password_confirm,
      user_type: this.user ? 'job_seeker' : 'employer', // adjust if your API expects a different value
      phone: this.model.phone
    };

    if (payload.password !== payload.password_confirm) {
      this.toastr.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    this.http.post(environment.getUrl('register', 'accounts'), payload).subscribe({
      next: (res: any) => {
        this.toastr.success('تم إنشاء الحساب بنجاح');
        // Option A: send user to login
        if(this.user){
          this.router.navigateByUrl('/jobseeker');
        } else {
          const resCompany: any = {
            name: res.data.user.username,
            description: 'Default description',
            email: res.data.user.email,
            city: 'Sana\'a',
            size: 'startup',
            industry: 'technology',
            address: 'Default address',
            country: 'Yemen',
            founded_year: new Date().getFullYear(),
            website: '',
            phone: '',
            employees_count: 1

          }
          debugger;
          localStorage.setItem('access', res.data.token);
          this.companyService.createCompany(resCompany).subscribe();
          this.router.navigateByUrl('/companies');
        }
        // Option B: if API returns tokens, you can store and redirect directly:
        // localStorage.setItem('access', res.access); ...
      },
      error: (err) => {
        this.errors.error(err, { join: true }) 
      }
    });
  }
  isInvalidPhone(): boolean {
  const phoneRegex = /^7[0-9]{8}$/;
  return !phoneRegex.test(this.model.phone);
}
}
