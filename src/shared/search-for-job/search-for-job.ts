import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService as CompanyDataService } from 'app/pages/companies/core/services/company.service';
import { CompanyService } from 'shared/services/company.service';
import { ICompanyData } from 'app/pages/companies/core/models';
import { INDUSTRY_TYPES, COMPANY_SIZES } from 'app/pages/companies/core/enums';
import { environment } from 'environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { Errors } from 'shared/services/errors';
import { SharedModule } from '../shared-module';

interface CompanyDisplay {
  id?: number;
  slug?: string;
  name: string;
  industry: string;
  location: string;
  logo: string;
  description: string;
  employees: number | null;
  openJobs: number;
  followers: number;
  tags: string[];
  size: string;
  featured: boolean;
  following: boolean;
}

@Component({
  selector: 'app-search-for-job',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedModule],
  templateUrl: './search-for-job.html',
  styleUrls: ['./search-for-job.scss'],
})
export class SearchForJob implements OnInit {
  private companyDataService = inject(CompanyDataService);
  private companyService = inject(CompanyService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private errors = inject(Errors);

  companiesData: CompanyDisplay[] = [];
  featuredCompanies: CompanyDisplay[] = [];
  
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;

  industryFilter = '';
  locationFilter = '';
  sizeFilter = '';
  searchTerm = '';

  INDUSTRY_TYPES = INDUSTRY_TYPES;
  COMPANY_SIZES = COMPANY_SIZES;

  // Available cities (you can fetch these from API if available)
  cities = [
    { value: 'sanaa', label: 'صنعاء' },
    { value: 'aden', label: 'عدن' },
    { value: 'taiz', label: 'تعز' },
    { value: 'hodeidah', label: 'الحديدة' },
    { value: 'ibb', label: 'إب' },
    { value: 'dhamar', label: 'ذمار' },
    { value: 'mukalla', label: 'المكلا' },
  ];

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    
    const params: any = {
      page: this.currentPage,
      page_size: this.pageSize,
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    if (this.industryFilter) {
      params.industry = this.industryFilter;
    }
    if (this.locationFilter) {
      params.city = this.locationFilter;
    }
    if (this.sizeFilter) {
      params.size = this.sizeFilter;
    }

    this.companyDataService.getAllCompanies(params).subscribe({
      next: (response) => {
        this.companiesData = (response.results || []).map(company => this.mapToDisplay(company));
        this.totalCount = response.count || 0;
        
        // Load featured companies separately
        this.loadFeaturedCompanies();
        this.loading = false;
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.loading = false;
      }
    });
  }

  loadFeaturedCompanies(): void {
    this.companyDataService.getAllCompanies({ is_featured: true, page_size: 4 }).subscribe({
      next: (response) => {
        this.featuredCompanies = (response.results || []).map(company => this.mapToDisplay(company));
      },
      error: (err) => {
        console.error('Failed to load featured companies', err);
      }
    });
  }

  private mapToDisplay(company: ICompanyData & { 
    is_following?: boolean; 
    followers_count?: number; 
    active_jobs?: number;
    is_featured?: boolean;
  }): CompanyDisplay {
    const industryLabel = INDUSTRY_TYPES.find(i => i.value === company.industry)?.label || company.industry;
    const sizeLabel = COMPANY_SIZES.find(s => s.value === company.size)?.label || company.size;
    
    return {
      id: company.id,
      slug: company.slug,
      name: company.name,
      industry: industryLabel,
      location: company.city || company.country || 'غير محدد',
      logo: this.getCompanyLogo(company.logo),
      description: company.description || '',
      employees: company.employees_count,
      openJobs: company.active_jobs || 0,
      followers: company.followers_count || 0,
      tags: [], // TODO: Get from API if available
      size: sizeLabel,
      featured: company.is_featured || false,
      following: company.is_following || false,
    };
  }

  getCompanyLogo(logo: string | null | undefined): string {
    if (!logo) return 'images/company-logo-1.jpg';
    if (logo.startsWith('http') || logo.startsWith('blob:') || logo.startsWith('data:')) {
      return logo;
    }
    return `${environment.apiBaseUrl.replace(/\/+$/, '')}/${logo.replace(/^\/+/, '')}`;
  }

  viewCompany(companyId: string | number | undefined): void {
    if (!companyId) return;
    
    // Try to find company by slug or id
    const company = this.companiesData.find(c => 
      (c.slug && c.slug === companyId) || 
      (c.id && c.id.toString() === companyId.toString())
    );
    
    if (company?.slug) {
      this.router.navigate(['/company', company.slug]);
    } else {
      this.router.navigate(['/companies/company-profile']);
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCompanies();
  }

  toggleFollow(companyId: string | number | undefined): void {
    if (!companyId) return;
    
    // Find company in main list
    let company = this.companiesData.find((c) => 
      (c.id && c.id.toString() === companyId.toString()) ||
      (c.slug && c.slug === companyId)
    );
    
    // If not found, check featured companies
    if (!company) {
      company = this.featuredCompanies.find((c) => 
        (c.id && c.id.toString() === companyId.toString()) ||
        (c.slug && c.slug === companyId)
      );
    }
    
    if (!company || !company.id) {
      this.toastr.error('لم يتم العثور على الشركة');
      return;
    }

    const wasFollowing = company.following;
    const previousFollowersCount = company.followers;

    // Optimistically update UI
    company.following = !wasFollowing;
    company.followers = wasFollowing
      ? Math.max(0, previousFollowersCount - 1)
      : previousFollowersCount + 1;

    // Update in both lists if exists (find the same company in the other list)
    const otherListCompany = company === this.companiesData.find(c => c.id === company!.id)
      ? this.featuredCompanies.find(c => c.id === company!.id)
      : this.companiesData.find(c => c.id === company!.id);
    
    if (otherListCompany && otherListCompany !== company) {
      otherListCompany.following = company.following;
      otherListCompany.followers = company.followers;
    }

    const followAction = wasFollowing
      ? this.companyService.unfollowCompany(company.id)
      : this.companyService.followCompany(company.id);

    followAction.subscribe({
      next: () => {
        this.toastr.success(
          wasFollowing ? 'تم إلغاء متابعة الشركة' : 'تم متابعة الشركة بنجاح'
        );
      },
      error: (err) => {
        // Revert optimistic update on error
        company!.following = wasFollowing;
        company!.followers = previousFollowersCount;
        
        if (otherListCompany) {
          otherListCompany.following = wasFollowing;
          otherListCompany.followers = previousFollowersCount;
        }
        
        this.errors.error(err, { join: true });
      },
    });
  }

  getIndustryLabel(value: string): string {
    const industry = INDUSTRY_TYPES.find(i => i.value === value);
    return industry ? industry.label : value;
  }

  getSizeLabel(value: string): string {
    const size = COMPANY_SIZES.find(s => s.value === value);
    return size ? size.label : value;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'images/company-logo-1.jpg';
    }
  }
}