import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { CompanyService } from 'app/pages/companies/core/services/company.service';
import { Base } from 'shared/base/base';
import { AuthService } from '../auth.service';
import { UserRole } from 'core/types';


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
  auth = inject(AuthService);

  isLoading = signal(false);

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
    // Clear any stale auth data when entering register page
    // This ensures a clean state when switching between accounts
    // this.auth.logout();
  }

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = !this.user;
  }

  register(f: NgForm) {
    this.isLoading.set(true);
    // username: usually email (or generate one). Using email keeps it simple.
    if (f.invalid) {
      // علّم جميع الحقول كـ touched ليظهر التنبيه فورًا
      Object.values(f.controls).forEach(ctrl => {
        ctrl.markAsTouched();
        ctrl.updateValueAndValidity();
      });
      // رسالة عامة
      this.toastr.error('فضلاً صحّح الأخطاء ثم أعد المحاولة');
      this.isLoading.set(false);
      return;
    }

    // تحقّق إضافي للهاتف (احتياطًا)
    if (!/^7[0-9]{8}$/.test(this.model.phone)) {
      this.toastr.error('رقم الهاتف يجب أن يبدأ بـ 7 ويتكون من 9 أرقام');
      this.isLoading.set(false);
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
      this.isLoading.set(false);
      this.toastr.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    this.http.post(environment.getUrl('register', 'accounts'), payload).subscribe({
      next: (res: any) => {
        const access = res?.data?.token as string | undefined;
        this.isLoading.set(false);

        if (!access) {
          this.toastr.error('استجابة غير متوقعة من الخادم: لم يتم استلام رمز الدخول.');
          return;
        }

        // Determine role based on user type selection
        const role: UserRole = this.user ? 'jobseeker' : 'employer';
        
        // Clear any stale auth data first
        // this.auth.logout();
        
        // Set token and role using AuthService
        // this.auth.setTokens(access, res?.refresh);
        // this.auth.setRole(role);
        
        this.toastr.success('تم إنشاء الحساب بنجاح');
        
        f.reset();

        // if (this.user) {
        //   // Jobseeker: navigate to jobseeker dashboard
        //   this.router.navigateByUrl('/jobseeker');
        // } else {
        //   // Employer: create company profile then navigate
        //   const resCompany: any = {
        //     name: res.data.user.username,
        //     description: 'Default description',
        //     email: res.data.user.email,
        //     city: 'Sana\'a',
        //     size: 'startup',
        //     industry: 'technology',
        //     address: 'Default address',
        //     country: 'Yemen',
        //     founded_year: new Date().getFullYear(),
        //     website: '',
        //     phone: '',
        //     employees_count: 1
        //   };
          
        //   this.companyService.createCompany(resCompany).subscribe({
        //     next: () => {
        //       this.router.navigateByUrl('/companies');
        //     },
        //     error: (err) => {
        //       // Even if company creation fails, user is logged in
        //       // Navigate anyway - they can create company later
        //       console.error('Failed to create company:', err);
        //       this.router.navigateByUrl('/companies');
        //     }
        //   });
        // }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errors.error(err, { join: true });
      }
    });
  }
  isInvalidPhone(): boolean {
  const phoneRegex = /^7[0-9]{8}$/;
  return !phoneRegex.test(this.model.phone);
}
}
