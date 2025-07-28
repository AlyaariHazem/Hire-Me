import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../../../shared/header/header';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-login',
  imports: [CommonModule, SharedModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [Document],
})
export class Login {
  constructor(private router: Router, private doc: Document) {}
  user: boolean = true;
  admin: boolean = false;

  login(): void {
    debugger;
    if(this.user) {
      this.router.navigateByUrl('/jobseeker');
    }else if(this.admin) {
      this.router.navigateByUrl('/companies');
    }
  }
selectType(type: 'jobseeker' | 'employer') {
  this.user = type === 'jobseeker';
  this.admin = type === 'employer';
}

}
