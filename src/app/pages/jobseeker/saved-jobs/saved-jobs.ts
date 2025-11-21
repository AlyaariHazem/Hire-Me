import { Component, OnInit, inject } from '@angular/core';
import { Base } from 'shared/base/base';
import { JobService } from 'shared/services/job.service';
import { SharedModule } from 'shared/shared-module';
import { JobItem } from '@app/companies/models';

@Component({
  selector: 'app-saved-jobs',
  imports: [SharedModule],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss',
})
export class SavedJobs extends Base implements OnInit {
  // English: inject job service
  private jobService = inject(JobService);

  // English: saved jobs list
  jobs: JobItem[] = [];

  // English: paging info
  page = 1;
  pageSize = 10;
  totalCount = 0;

  // English: ui state
  loading = false;
  errorMessage: string | null = null;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadSavedJobs();
  }

  // English: load bookmarked jobs from API
  loadSavedJobs(): void {
    this.loading = true;
    this.errorMessage = null;

    this.jobService
      .getBookmarkedJobs({
        page: this.page,
        page_size: this.pageSize,
      })
      .subscribe({
        next: (res) => {
          this.jobs = res.results;
          this.totalCount = res.count;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'حدث خطأ أثناء تحميل الوظائف المحفوظة';
          // English: if Base has global error handler, use it
          // this.handleError(err);
          console.error(err);
        },
      });
  }

  // English: remove job from bookmarks and update list
  removeFromSaved(job: JobItem): void {
    // English: ensure id exists
    if (job?.id == null) {
      return;
    }

    this.jobService.unbookmarkJob(job.id).subscribe({
      next: () => {
        // English: remove from current list without reloading whole page
        this.jobs = this.jobs.filter((j) => j.id !== job.id);
        this.totalCount = Math.max(this.totalCount - 1, 0);

        // English: if list became empty and we are on a page > 1, go back one page
        if (this.jobs.length === 0 && this.page > 1) {
          this.page--;
          this.loadSavedJobs();
        }
      },
      error: (err) => {
        console.error(err);
        // English: keep simple message
        this.errorMessage = 'تعذر إزالة الوظيفة من المحفوظة';
      },
    });
  }

  // English: total pages based on count
  get totalPages(): number {
    return this.pageSize > 0
      ? Math.max(1, Math.ceil(this.totalCount / this.pageSize))
      : 1;
  }

  // English: array for *ngFor pagination
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // English: change current page
  goToPage(page: number): void {
    if (page === this.page || page < 1 || page > this.totalPages) {
      return;
    }
    this.page = page;
    this.loadSavedJobs();
  }
}
