import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
constructor(private router: Router) { }
login():void{
  this.router.navigateByUrl('/jobseeker');
}
}
