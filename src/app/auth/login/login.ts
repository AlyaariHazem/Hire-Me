import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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

  email: string = '';
  password: string = '';

  login(): void {
    const payload = {
      username: this.email,
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
        this.toastr.error('فشل تسجيل الدخول، تحقق من البيانات');
        console.error(err);
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
