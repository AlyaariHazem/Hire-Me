import { Component } from '@angular/core';

@Component({
  selector: 'app-company-profile',
  standalone: false,
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.scss'
})
export class CompanyProfile {
  activeTab: string = 'overview'; // default active tab

  showTab(tab: string): void {
    this.activeTab = tab;
  }
}
