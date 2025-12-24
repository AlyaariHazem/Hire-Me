import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
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

  isLoading = signal(false);
  showVerificationModal = signal(false);
  verificationCode = '';
  isVerifying = signal(false);
  isResending = signal(false);
  registeredPhone = '';

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
        this.isLoading.set(false);
        
        // Check if verification is required
        const isVerified = res?.data?.user?.is_verified ?? false;
        
        if (isVerified) {
          // User is already verified, show success and redirect to login
          this.toastr.success('تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول');
          f.reset();
          // Redirect to login page after a short delay
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
        } else {
          // Show verification modal
          this.registeredPhone = this.model.phone;
          this.showVerificationModal.set(true);
          this.toastr.info('تم إرسال رمز التحقق إلى رقم الهاتف الخاص بك');
        }
        
        f.reset();
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

  verifyCode(): void {
    if (!this.verificationCode || this.verificationCode.length < 4) {
      this.toastr.error('الرجاء إدخال رمز التحقق');
      return;
    }

    this.isVerifying.set(true);

    // API endpoint: POST /api/accounts/verify-phone/
    const verifyUrl = `${environment.apiBaseUrl}/api/accounts/verify-phone/`;
    
    this.http.post(verifyUrl, {
      phone: this.registeredPhone,
      verification_code: this.verificationCode
    }).subscribe({
      next: (res: any) => {
        this.isVerifying.set(false);
        
        // Close verification modal and show success message
        this.showVerificationModal.set(false);
        this.verificationCode = '';
        this.toastr.success('تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      error: (err) => {
        this.isVerifying.set(false);
        this.errors.error(err, { join: true });
        this.toastr.error('رمز التحقق غير صحيح');
      }
    });
  }

  resendVerificationCode(): void {
    if (!this.registeredPhone) {
      this.toastr.error('رقم الهاتف غير متوفر');
      return;
    }

    this.isResending.set(true);

    // API endpoint: POST /api/accounts/resend-verification-code/
    const resendUrl = `${environment.apiBaseUrl}/api/accounts/resend-verification-code/`;
    
    this.http.post(resendUrl, {
      phone: this.registeredPhone
    }).subscribe({
      next: () => {
        this.isResending.set(false);
        this.toastr.success('تم إعادة إرسال رمز التحقق');
      },
      error: (err) => {
        this.isResending.set(false);
        this.errors.error(err, { join: true });
      }
    });
  }


  closeVerificationModal(): void {
    this.showVerificationModal.set(false);
    this.verificationCode = '';
  }
}
