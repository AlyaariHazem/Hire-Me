import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header1',
  imports:[CommonModule,
RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderPublic {}
