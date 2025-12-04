import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CompanyService, Company } from 'shared/services/company.service';
import { SharedModule } from 'shared/shared-module';
import { CommonModule } from '@angular/common';
import { Base } from 'shared/base/base';
import { ToastrService } from 'ngx-toastr';
import { JobItem } from '@app/companies/models';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterLink],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.scss'
})
export class CompanyProfile extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);

  company: Company | null = null;
  companyJobs: JobItem[] = [];
  isLoading = false;
  isLoadingJobs = false;
  isTogglingFollow = false;
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
        this.errors.error(err, { join: true });
        this.isLoading = false;
      },
    });
  }

  toggleFollow(): void {
    if (!this.company || this.isTogglingFollow) return;

    this.isTogglingFollow = true;
    const wasFollowing = this.company.is_following;
    const previousFollowersCount = this.company.followers_count;

    // Optimistically update UI
    this.company.is_following = !wasFollowing;
    this.company.followers_count = wasFollowing
      ? previousFollowersCount - 1
      : previousFollowersCount + 1;

    const followAction = wasFollowing
      ? this.companyService.unfollowCompany(this.company.id)
      : this.companyService.followCompany(this.company.id);

    followAction.subscribe({
      next: () => {
        this.isTogglingFollow = false;
        this.toastr.success(
          wasFollowing ? 'تم إلغاء متابعة الشركة' : 'تم متابعة الشركة بنجاح'
        );
        // Reload company data to ensure consistency
        const slug = this.route.snapshot.paramMap.get('slug');
        if (slug) {
          this.loadCompany(slug);
        }
      },
      error: (err) => {
        // Revert optimistic update on error
        this.company!.is_following = wasFollowing;
        this.company!.followers_count = previousFollowersCount;
        this.isTogglingFollow = false;
        this.errors.error(err, { join: true });
      },
    });
  }

  showTab(tab: string): void {
    this.activeTab = tab;
    // Load jobs when jobs tab is selected
    if (tab === 'jobs' && this.company && this.companyJobs.length === 0) {
      this.loadCompanyJobs();
    }
  }

  loadCompanyJobs(): void {
    if (!this.company) return;

    this.isLoadingJobs = true;
    this.companyService.getCompanyJobs(this.company.id).subscribe({
      next: (response) => {
        // Handle the response structure: { jobs: [...], total_count: ... }
        const jobs = response.jobs || response.results || response || [];
        console.log('Company jobs response:', response);
        console.log('Extracted jobs:', jobs);
        this.companyJobs = jobs.map((job: any) => ({
          ...job,
          company: job.company || this.company,
          category: job.category || { id: 0, name: '-' },
        }));
        console.log('Mapped companyJobs:', this.companyJobs);
        this.isLoadingJobs = false;
      },
      error: (err) => {
        console.error('Error loading company jobs:', err);
        this.errors.error(err, { join: true });
        this.companyJobs = [];
        this.isLoadingJobs = false;
      },
    });
  }

  // Helper methods for job display
  formatSalary(job: JobItem): string {
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ريال`;
    }
    if (job.salary_min) {
      return `ابتداءً من ${job.salary_min.toLocaleString()} ريال`;
    }
    if (job.salary_max) {
      return `حتى ${job.salary_max.toLocaleString()} ريال`;
    }
    return 'غير محدد';
  }

  getJobTypeLabel(type: string | null | undefined): string {
    switch (type) {
      case 'full_time':
        return 'دوام كامل';
      case 'part_time':
        return 'دوام جزئي';
      case 'remote':
        return 'عمل عن بُعد';
      case 'contract':
        return 'عقد مؤقت';
      default:
        return 'غير محدد';
    }
  }

  timeAgo(date: string): string {
    const now = new Date();
    const jobDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - jobDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    if (diffInSeconds < 31536000) return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    return `منذ ${Math.floor(diffInSeconds / 31536000)} سنة`;
  }

  cityLabel(city: string | null | undefined): string {
    return city || 'غير محدد';
  }
}
