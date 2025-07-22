import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

}
