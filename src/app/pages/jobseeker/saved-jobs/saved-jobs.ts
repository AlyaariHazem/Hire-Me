import { Component, OnInit, inject } from '@angular/core';
import { Base } from 'shared/base/base';
import { SharedModule } from 'shared/shared-module';
import { JobItem } from '@app/companies/models';
import { environment } from 'environments/environment';
import { SavedJobsStoreService, BookmarkedJobItem } from '../services/saved-jobs.service';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './saved-jobs.html',
  styleUrl: './saved-jobs.scss',
})
export class SavedJobs extends Base implements OnInit {
  private savedJobsStore = inject(SavedJobsStoreService);

  // Saved bookmarks list
  bookmarks: BookmarkedJobItem[] = [];

  // Paging info
  page = 1;
  page_size = 10;
  totalCount = 0;

  // UI state
  loading = false;
  errorMessage: string | null = null;
  baseUrl = environment.apiBaseUrl;

  constructor() {
    super();
  }

  ngOnInit(): void {
    // Subscribe to loading state
    this.savedJobsStore.loading$.subscribe(loading => {
      this.loading = loading;
    });

    // Subscribe to saved jobs data
    this.savedJobsStore.savedJobs$.subscribe({
      next: (data) => {
        this.bookmarks = data.bookmarks;
        this.totalCount = data.totalCount;
        this.page = data.currentPage;
        this.page_size = data.page_size;
        this.errorMessage = null;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'حدث خطأ أثناء تحميل الوظائف المحفوظة';
        console.error(err);
      },
    });

    // Load initial saved jobs
    this.savedJobsStore.loadSavedJobs();
  }

  removeFromSaved(job: JobItem): void {
    // Optimistic toggle value
    const newValue = !job.is_bookmarked;

    this.savedJobsStore.removeBookmark(job.id).subscribe({
      next: () => {
        // Update UI state so button text / class change immediately
        job.is_bookmarked = newValue;

        this.toastr.success(
          newValue
            ? `تم حفظ الوظيفة ${job.id} بنجاح`
            : `تم إزالة الوظيفة ${job.id} من المحفوظات`
        );
      },
      error: () => {
        // Keep old value because API failed
        this.toastr.error('تعذر حفظ الوظيفة');
        // Refresh to get correct state
        this.savedJobsStore.refresh();
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

  // Total pages based on count
  get totalPages(): number {
    return this.savedJobsStore.snapshot.totalPages;
  }

  // Array for pagination
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Change current page
  goToPage(page: number): void {
    this.savedJobsStore.goToPage(page);
  }

  /**
   * Refresh saved jobs data
   */
  refreshSavedJobs(): void {
    this.savedJobsStore.refresh();
  }
}
