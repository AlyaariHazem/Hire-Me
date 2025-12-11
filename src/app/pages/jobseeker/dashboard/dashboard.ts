import { Component, OnInit, inject } from '@angular/core';
import { User } from '../services/user';
import { DashboardStoreService } from 'app/pages/jobseeker/services/dashboard.service';
import { JobStatistics } from 'shared/services/job.service';
import { Application } from 'shared/services/application.service';
import { JobItem } from '@app/companies/models';
import { BreadcrumbService } from 'shared/services/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  userData: any;
  stats: JobStatistics | null = null;
  recentApplications: Application[] = [];
  savedJobs: JobItem[] = [];

  private userService = inject(User);
  private dashboardStore = inject(DashboardStoreService);
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.userService.user$.subscribe(data => {
      this.userData = data;
    });

    // Load dashboard data from store
    this.dashboardStore.ensureLoaded();

    // Subscribe to dashboard data
    this.dashboardStore.dashboard$.subscribe(data => {
      this.stats = data.stats;
      this.recentApplications = data.recentApplications;
      this.savedJobs = data.savedJobs;
    });

    // Listen for breadcrumb refresh
    this.breadcrumbService.refresh$.subscribe(() => {
        this.refreshDashboard();
        // Also refresh user data if needed, or just dashboard
        this.dashboardStore.refresh();
    });
  }

  /**
   * Refresh dashboard data (useful after actions like applying to a job)
   */
  refreshDashboard(): void {
    this.dashboardStore.refresh();
  }

  /**
   * Get company route - use slug if available, otherwise use ID
   */
  getCompanyRoute(company: { id: number; name: string; logo: string | null; city: string; slug?: string }): any[] {
    return ['/company', (company as any).slug || company.id];
  }
}
