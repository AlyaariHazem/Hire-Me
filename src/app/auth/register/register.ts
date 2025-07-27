import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, SharedModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
