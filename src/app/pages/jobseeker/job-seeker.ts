import { Component } from '@angular/core';
import { User } from './services/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job-seeker',
  standalone: false,
  templateUrl: './job-seeker.html',
  styleUrl: './job-seeker.scss',
  providers: [User,HttpClient]
})
export class JobSeeker {
  userData: any;
  constructor(private userService: User) {
    this.userService.user$.subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
  }
}
