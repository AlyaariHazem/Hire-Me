import { Component } from '@angular/core';
import { User } from '../services/user';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar {
userData: any;
  constructor(private userService: User) {
    this.userService.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
  }
}
