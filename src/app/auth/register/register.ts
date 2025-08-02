import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user: boolean = true;
  admin: boolean = false;

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = type === 'employer';
  }

}
