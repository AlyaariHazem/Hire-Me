import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Errors } from '../../../shared/services/errors';
import { AuthService } from '../auth.service';

type Role = 'jobseeker' | 'employer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [Document],
})
export class Login implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // Let the user explicitly select one of these:
  user: boolean = false;   // jobseeker
  admin: boolean = false;  // employer

  errors = inject(Errors);

  phone: string = '';
  password: string = '';

  ngOnInit(): void {
    // If token already exists, skip login
    if (this.auth.isLoggedIn()) {
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

  private selectedRole(): Role | null {
    if (this.user && !this.admin) return 'jobseeker';
    if (this.admin && !this.user) return 'employer';
    return null; // none or both selected
  }

  private mapBackendRole(user_type: string | undefined | null): Role | null {
    // Adjust mapping if your backend uses different strings
    // e.g., 'job_seeker' | 'employer'
    if (!user_type) return null;
    const norm = String(user_type).toLowerCase();
    if (norm === 'job_seeker' || norm === 'jobseeker') return 'jobseeker';
    if (norm === 'employer' || norm === 'company' || norm === 'recruiter') return 'employer';
    return null;
  }

  login(): void {
    // 1) Must choose a role
    const chosen = this.selectedRole();
    if (!chosen) {
      this.toastr.error('الرجاء اختيار نوع الحساب (باحث عن عمل أو صاحب عمل) قبل تسجيل الدخول.');
      return;
    }

    // 2) Validate inputs
    if (this.isInvalidPhone()) {
      this.toastr.error('رقم الهاتف يجب أن يتكون من 9 أرقام فقط');
      return;
    }
    if (!this.password?.trim()) {
      this.toastr.error('الرجاء إدخال كلمة المرور');
      return;
    }

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

        // 4) Fetch profile to verify backend role
        this.getProfile().subscribe({
          next: (data: any) => {
            const backendType = data?.data?.user?.user_type as string | undefined;
            const backendRole = this.mapBackendRole(backendType);

            if (!backendRole) {
              this.toastr.error('لا يمكن تحديد نوع الحساب من الخادم.');
              this.auth.logout(); // clear temporary tokens
              return;
            }

            // 5) Compare selected role with backend role
            if (backendRole !== chosen) {
              const chosenAr = chosen === 'jobseeker' ? 'باحث عن عمل' : 'صاحب عمل';
              const backendAr = backendRole === 'jobseeker' ? 'باحث عن عمل' : 'صاحب عمل';
              this.toastr.error(
                `نوع الحساب الذي اخترته (${chosenAr}) لا يطابق نوع حسابك الفعلي (${backendAr}).`
              );
              this.auth.logout(); // prevent entering with wrong role
              return;
            }

            // 6) Role matches → persist role & go in
            this.auth.setRole(backendRole);
            this.toastr.success('تم تسجيل الدخول بنجاح');
            this.router.navigateByUrl(backendRole === 'employer' ? '/companies' : '/jobseeker');
          },
          error: (err) => {
            this.errors.error(err, { join: true });
            this.auth.logout(); // clear temp tokens on failure
          },
        });
      },
      error: (err) => {
        this.errors.error(err, { join: true });
      },
    });
  }

  getProfile() {
    // Adjust second argument if your environment.getUrl accepts a namespace
    // In your snippet: environment.getUrl('profile', 'accounts')
    return this.http.get(environment.getUrl('profile', 'accounts'));
  }

  loginWithLinkedIn() {
    this.toastr.info('تسجيل الدخول عبر LinkedIn قيد التطوير');
  }

  loginWithGoogle() {
    this.toastr.info('تسجيل الدخول عبر Google قيد التطوير');
  }

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = type === 'employer';
  }
}
