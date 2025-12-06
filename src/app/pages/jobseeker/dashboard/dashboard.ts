import { Component, OnInit, inject } from '@angular/core';
import { User } from '../services/user';
import { DashboardStoreService } from 'app/pages/jobseeker/services/dashboard.service';
import { JobStatistics } from 'shared/services/job.service';
import { Application } from 'shared/services/application.service';
import { JobItem } from '@app/companies/models';

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
  }

  /**
   * Refresh dashboard data (useful after actions like applying to a job)
   */
  refreshDashboard(): void {
    this.dashboardStore.refresh();
  }
}
