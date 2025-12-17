import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UserRole, UserType } from 'core/types';
import { Router } from '@angular/router';
import { take } from 'rxjs'; // Import take

import { SharedModule } from 'shared/shared-module';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { AuthService } from '../auth.service';
import { Base } from 'shared/base/base';
import { ProfileStoreService } from 'shared/services/profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [Document],
})
export class Login extends Base implements OnInit {
  private profileStore = inject(ProfileStoreService);

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService
  ) {
    super();
  }

  // Let the user explicitly select one of these:
  user: boolean = true;   // jobseeker
  admin: boolean = false;  // employer


  phone: string = '';
  password: string = '';
  isSubmitting: boolean = false;
  
  // Phone verification state
  showVerificationModal = false;
  verificationCode = '';
  isVerifying = false;
  isResending = false;

  ngOnInit(): void {
    debugger;
    const token = localStorage.getItem('access');
    // Clear profile store if user is not logged in (remove stale data)
    if (!this.auth.isLoggedIn()) {
      this.profileStore.reset();
    }
    
    // If token already exists, skip login
    if (token) {
      const role = this.auth.role ?? 'jobseeker';
      this.router.navigateByUrl(role === 'employer' ? '/companies' : '/jobseeker');
    }
  }

  // Optional: stricter 9-digit check (or use /^7\d{8}$/ if needed)
  isInvalidPhone(): boolean {
    if (!this.phone) return false;
    const phoneRegex = /^[0-9]{9}$/;
    return !phoneRegex.test(this.phone);
  }

  private selectedRole(): UserType | null {
    if (this.user && !this.admin) return 'jobseeker';
    if (this.admin && !this.user) return 'employer';
    return null; // none or both selected
  }

  private mapBackendRole(user_type: string | undefined | null): UserType | null {
    // Adjust mapping if your backend uses different strings
    // e.g., 'job_seeker' | 'employer'
    if (!user_type) return null;
    const norm = String(user_type).toLowerCase();
    if (norm === 'job_seeker' || norm === 'jobseeker') return 'jobseeker';
    if (norm === 'employer' || norm === 'company' || norm === 'recruiter') return 'employer';
    return null;
  }

  login(): void {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    // 1) Must choose a role
    // const chosen = this.selectedRole();
    // if (!chosen) {
    //   this.toastr.error('الرجاء اختيار نوع الحساب (باحث عن عمل أو صاحب عمل) قبل تسجيل الدخول.');
    //   return;
    // }

    // 2) Validate inputs
    if (this.isInvalidPhone()) {
      this.toastr.error('رقم الهاتف يجب أن يتكون من 9 أرقام فقط');
      return;
    }
    if (!this.password?.trim()) {
      this.toastr.error('الرجاء إدخال كلمة المرور');
      return;
    }

    // Set submitting state
    this.isSubmitting = true;

    // 3) Attempt login
    const payload = { phone: this.phone, password: this.password };

    this.http.post(environment.getUrl('login'), payload).subscribe({
      next: (res: any) => {
        // Expect: { data: { token: string }, refresh?: string }
        const access = res?.data?.token as string | undefined;
        const refresh = res?.refresh as string | undefined;

        if (!access) {
          this.toastr.error('استجابة غير متوقعة من الخادم: لم يتم استلام رمز الدخول.');
          return;
        }

        // Temporarily set tokens to call /profile
        this.auth.setTokens(access, refresh);
        
        // Reset and load profile via store
        this.profileStore.reset();
        this.profileStore.ensureLoaded();

        // 4) Fetch profile to verify backend role
        // We subscribe to profile$ which will emit once loaded
        this.profileStore.profile$
          .pipe(take(1)) // specific import needed
          .subscribe({
          next: (profile) => {
            if (!profile) return; // wait for valid profile
            const backendType = profile.user.user_type; // Adjust based on Profile interface
            // Note: Profile interface in service has 'user' object. 
            // In original code: data?.data?.user?.user_type. 
            // ProfileStoreService returns the inner 'profile' object but the Interface definition says:
            // export interface Profile { ... user: { ... user_type ... } }
            // So `profile.user.user_type` should be correct if the interface matches.
            
            const backendRole = this.mapBackendRole(backendType);

            if (!backendRole) {
              this.toastr.error('لا يمكن تحديد نوع الحساب من الخادم.');
              this.auth.logout(); // clear temporary tokens
              return;
            }

            // 6) Role matches → persist role & go in
            this.auth.setRole(backendRole as UserRole);
            this.toastr.success('تم تسجيل الدخول بنجاح');
            this.router.navigateByUrl(backendRole === 'employer' ? '/companies' : '/jobseeker');
            this.isSubmitting = false;
          },
          error: (err) => {
            this.errors.error(err, { join: true });
            this.auth.logout(); // clear temp tokens on failure
            this.isSubmitting = false;
          },
        });
      },
      error: (err) => {
        // Check if error is about phone verification
        const errorMessage = err?.error?.data?.non_field_errors?.[0] || 
                            err?.error?.non_field_errors?.[0] ||
                            err?.error?.message || '';
        
        if (errorMessage.includes('يجب التحقق من رقم الهاتف أولاً') || 
            errorMessage.includes('يجب التحقق من رقم الهاتف')) {
          // Show verification modal
          this.showVerificationModal = true;
          this.toastr.info('يجب التحقق من رقم الهاتف أولاً. تم إرسال رمز التحقق إلى رقم الهاتف الخاص بك');
        } else {
          // Show other errors normally
          this.errors.error(err, { join: true });
        }
        this.isSubmitting = false;
      },
    });
  }

  loginWithLinkedIn() {
    this.toastr.info('تسجيل الدخول عبر LinkedIn قيد التطوير');
  }

  loginWithGoogle() {
    this.toastr.info('تسجيل الدخول عبر Google قيد التطوير');
  }

  selectType(role: UserRole) {
    this.user = role === 'jobseeker';
    this.admin = role === 'employer';
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  verifyCode(): void {
    if (!this.verificationCode || this.verificationCode.length < 6) {
      this.toastr.error('الرجاء إدخال رمز التحقق الكامل');
      return;
    }

    this.isVerifying = true;

    // API endpoint: POST /api/accounts/verify-phone/ (as per API docs)
    const verifyUrl = `${environment.apiBaseUrl}/api/accounts/verify-phone/`;
    
    this.http.post(verifyUrl, {
      phone: this.phone,
      verification_code: this.verificationCode
    }).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        this.toastr.success('تم التحقق بنجاح');
        this.showVerificationModal = false;
        
        // After verification, retry login
        this.login();
      },
      error: (err) => {
        this.isVerifying = false;
        this.errors.error(err, { join: true });
        this.toastr.error('رمز التحقق غير صحيح');
      }
    });
  }

  resendVerificationCode(): void {
    if (!this.phone) {
      this.toastr.error('رقم الهاتف غير متوفر');
      return;
    }

    this.isResending = true;

    // API endpoint: POST /api/accounts/resend-verification-code/
    const resendUrl = `${environment.apiBaseUrl}/api/accounts/resend-verification-code/`;
    
    this.http.post(resendUrl, {
      phone: this.phone
    }).subscribe({
      next: () => {
        this.isResending = false;
        this.toastr.success('تم إعادة إرسال رمز التحقق');
      },
      error: (err) => {
        this.isResending = false;
        this.errors.error(err, { join: true });
      }
    });
  }

  closeVerificationModal(): void {
    this.showVerificationModal = false;
    this.verificationCode = '';
  }
}
