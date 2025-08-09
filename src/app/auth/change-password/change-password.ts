import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-change-password',
   imports: [CommonModule, FormsModule, HttpClientModule,SharedModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {
  form = {
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  };

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  changePassword() {
    if (this.form.new_password !== this.form.new_password_confirm) {
      this.toastr.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    this.http.post(environment.getUrl('change-password', 'accounts'), this.form)
      .subscribe({
        next: (res: any) => {
          // per your docs: “new token returned”
          if (res?.access) localStorage.setItem('access', res.access);
          if (res?.refresh) localStorage.setItem('refresh', res.refresh);

          this.toastr.success('تم تغيير كلمة المرور بنجاح');
          // optionally clear form
          this.form = { old_password: '', new_password: '', new_password_confirm: '' };
        },
        error: (err) => {
          const msg = err?.error ? Object.values(err.error).flat().join(' | ') : 'فشل تغيير كلمة المرور';
          this.toastr.error(msg);
          console.error(err);
        }
      });
  }
}
