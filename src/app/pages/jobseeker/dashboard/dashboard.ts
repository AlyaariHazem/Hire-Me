import { Component, OnInit, inject } from '@angular/core';
import { User } from '../services/user';
import { JobService, JobStatistics, JobFilters } from 'shared/services/job.service';
import { ApplicationService, Application } from 'shared/services/application.service';
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
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);

  ngOnInit(): void {
    this.userService.user$.subscribe(data => {
      this.userData = data;
    });

    this.loadStats();
    this.loadRecentApplications();
    this.loadSavedJobs();
  }

  loadStats(): void {
    this.jobService.getJobStatistics().subscribe({
      next: (data) => {
        console.log('Statistics response:', data);
        this.stats = data;
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  loadRecentApplications(): void {
    this.applicationService.getMyApplications({ page_size: 3 }).subscribe({
      next: (data) => {
        console.log('Applications response:', data);
        this.recentApplications = data.results;
        console.log('Recent applications array:', this.recentApplications);
      },
      error: (err) => console.error('Failed to load applications', err)
    });
  }

  loadSavedJobs(): void {
    this.jobService.getBookmarkedJobs({ page_size: 5 }).subscribe({
      next: (data) => {
        console.log('Bookmarked jobs response:', data);
        // Check if results contain job objects directly or nested in bookmark objects
        if (data.results && data.results.length > 0) {
          // If results have a 'job' property, extract it; otherwise use as is
          this.savedJobs = data.results.map((item: any) => 
            item.job ? item.job : item
          );
        } else {
          this.savedJobs = [];
        }
        console.log('Saved jobs array:', this.savedJobs);
      },
      error: (err) => console.error('Failed to load saved jobs', err)
    });
  }
}
