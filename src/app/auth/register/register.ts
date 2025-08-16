import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';
import { HeaderPublic } from '../header/header';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, SharedModule, HttpClientModule,HeaderPublic],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user = true;      // job seeker default
  admin = false;    // employer

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
    private router: Router,
    private toastr: ToastrService
  ) {}

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = !this.user;
  }

  register() {
    // username: usually email (or generate one). Using email keeps it simple.
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
          this.router.navigateByUrl('/companies');
        }
        // Option B: if API returns tokens, you can store and redirect directly:
        // localStorage.setItem('access', res.access); ...
      },
      error: (err) => {
        // Show server-side validation errors nicely
        const msg = err?.error
          ? Object.values(err.error).flat().join(' | ')
          : 'فشل إنشاء الحساب';
        this.toastr.error(msg);
        console.error(err);
      }
    });
  }
}
