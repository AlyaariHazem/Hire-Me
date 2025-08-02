import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [Document],
})
export class Login {
  constructor(private router: Router, private toastr: ToastrService) {}
  user: boolean = true;
  admin: boolean = false;

  login(): void {
    debugger;
    if (this.user) {
      this.router.navigateByUrl('/jobseeker');
      this.toastr.success('مرحبا بك في HireMe');
    } else if (this.admin) {
      this.router.navigateByUrl('/companies');
    }
  }
  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = type === 'employer';
  }
}
