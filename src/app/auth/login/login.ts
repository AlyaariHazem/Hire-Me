import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Errors } from '../../../shared/services/errors';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [Document],
})
export class Login {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {}

  user: boolean = true;
  admin: boolean = false;
  errors = inject(Errors);
  
  phone: string = '';
  password: string = '';
isInvalidPhone(): boolean {
  if (!this.phone) return false; // لا يظهر أي خطأ إذا الحقل فاضي
  const phoneRegex = /^7[0-9]{8}$/;
  return !phoneRegex.test(this.phone);
}

  login(): void {
  if (!/^[0-9]{9}$/.test(this.phone)) {
    this.toastr.error('رقم الهاتف يجب أن يتكون من 9 أرقام فقط');
    return;
  }

  const payload = {
    phone: this.phone,
    password: this.password,
  };

  this.http.post(environment.getUrl('login'), payload).subscribe({
    next: (res: any) => {
      if (res?.refresh) localStorage.setItem('refresh', res.refresh);
      localStorage.setItem('access', res.data.token);
      this.toastr.success('تم تسجيل الدخول بنجاح');
      this.router.navigateByUrl(this.user ? '/jobseeker' : '/companies');
    },
    error: (err) => {
      this.errors.error(err, { join: true })
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
