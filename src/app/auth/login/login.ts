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
    this.router.navigateByUrl('/jobseeker');
  }
  chooseUser(): void {
    const user = this.doc.getElementById('user');
    console.log('the user is', user);
  }
}
