import { Component, OnInit, inject } from '@angular/core';
import { Base } from 'shared/base/base';
import { JobService } from 'shared/services/job.service';
import { SharedModule } from 'shared/shared-module';
import { JobItem } from '@app/companies/models';

// English: bookmark wrapper returned by API
interface BookmarkedJobItem {
  id: number; // English: bookmark id
  job: JobItem; // English: actual job payload
  created_at: string; // English: when it was bookmarked
}

// English: list response for bookmarks
interface BookmarkedJobsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookmarkedJobItem[];
}

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss',
})
export class SavedJobs extends Base implements OnInit {
  // English: inject job service
  private jobService = inject(JobService);

  // English: saved bookmarks list
  bookmarks: BookmarkedJobItem[] = [];

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

    // English: reuse getBookmarkedJobs but expect the bookmark wrapper
    this.jobService
      .getBookmarkedJobs({
        page: this.page,
        page_size: this.pageSize,
      })
      .subscribe({
        next: (res: any) => {
          const data = res as BookmarkedJobsResponse;
          this.bookmarks = data.results ?? [];
          this.totalCount = data.count ?? 0;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'حدث خطأ أثناء تحميل الوظائف المحفوظة';
          console.error(err);
        },
      });
  }

  removeFromSaved(job: JobItem): void {
    // optimistic toggle value
    const newValue = !job.is_bookmarked;

    this.jobService.bookmarkJob(job.id).subscribe({
      next: () => {
        // update UI state so button text / class change immediately
        job.is_bookmarked = newValue;
        this.loadSavedJobs();

        this.toastr.success(
          newValue
            ? `تم حفظ الوظيفة ${job.id} بنجاح`
            : `تم إزالة الوظيفة ${job.id} من المحفوظات`
        );
      },
      error: () => {
        // keep old value because API failed
        this.toastr.error('تعذر حفظ الوظيفة');
      },
    });
  }

  // English: util to show salary text nicely
  salaryText(job: JobItem): string {
    const min: any = (job as any).salary_min;
    const max: any = (job as any).salary_max;
    if (min == null && max == null) return 'الراتب قابل للتفاوض';
    if (min != null && max != null) return `${min} - ${max}`;
    if (min != null) return `من ${min}`;
    return `حتى ${max}`;
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
    if (page === this.page || page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadSavedJobs();
  }
}
