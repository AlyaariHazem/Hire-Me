import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Errors } from '../../../shared/services/errors';
import { AuthService } from '../auth.service';

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

  user: boolean = true;
  admin: boolean = false;
  errors = inject(Errors);

  phone: string = '';
  password: string = '';

  ngOnInit(): void {
    // Extra safety: if someone lands here while logged-in, jump to app.
    if (this.auth.isLoggedIn()) {
      const role = this.auth.role ?? 'jobseeker';
      this.router.navigateByUrl(role === 'employer' ? '/companies' : '/jobseeker');
    }
  }

  isInvalidPhone(): boolean {
    // Accept Yemeni/9-digit local format you used
    if (!this.phone) return false;
    const phoneRegex = /^[0-9]{9}$/; // or /^7\d{8}$/ if you want strictly starting with 7
    return !phoneRegex.test(this.phone);
  }

  login(): void {
    if (this.isInvalidPhone()) {
      this.toastr.error('رقم الهاتف يجب أن يتكون من 9 أرقام فقط');
      return;
    }

    const payload = { phone: this.phone, password: this.password };

    this.http.post(environment.getUrl('login'), payload).subscribe({
      next: (res: any) => {
        // Expecting shape: { data: { token: string }, refresh?: string }
        if (res?.refresh) this.auth.setTokens(res.data?.token, res.refresh);
        else this.auth.setTokens(res.data?.token);

        // Save role selection so we can restore after refresh
        const role = this.user ? 'jobseeker' : 'employer';
        this.auth.setRole(role);

        this.toastr.success('تم تسجيل الدخول بنجاح');
        this.router.navigateByUrl(role === 'employer' ? '/companies' : '/jobseeker');
      },
      error: (err) => {
        this.errors.error(err, { join: true });
      },
    });
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
