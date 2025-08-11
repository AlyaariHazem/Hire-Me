import { Component } from '@angular/core';
import { User } from '../services/user';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  userData: any;

  constructor(private userService: User) {
    this.userService.user$.subscribe(data => {
      this.userData = data;
    });
  }
}
