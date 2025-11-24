import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService, Company } from 'shared/services/company.service';
import { SharedModule } from 'shared/shared-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.scss'
})
export class CompanyProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);

  company: Company | null = null;
  isLoading = false;
  activeTab: string = 'overview';

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadCompany(slug);
    }
  }

  loadCompany(slug: string): void {
    this.isLoading = true;
    this.companyService.getCompanyBySlug(slug).subscribe({
      next: (data) => {
        this.company = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load company', err);
        this.isLoading = false;
      },
    });
  }

  showTab(tab: string): void {
    this.activeTab = tab;
  }
}
