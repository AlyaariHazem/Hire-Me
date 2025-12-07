import { Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

import { JobService, JobFilters, JobListResponse } from 'shared/services/job.service';
import { JobItem } from '@app/companies/models';
import { SharedModule } from 'shared/shared-module';
import { UserRole, UserType } from 'core/types';
import { LoaderService } from 'shared/services/loader.service';
import { ApplicationService } from 'shared/services/application.service';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { Base } from 'shared/base/base';
import { Router } from '@angular/router';
import { AuthStateService } from 'app/auth/auth-state.service';
import { JobsStoreService } from 'app/pages/jobseeker/services/jobs.service';

@Component({
  selector: 'app-jobs',
  imports: [SharedModule, InputTextModule, Select, ButtonModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss'
})
export class Jobs extends Base {
  router = inject(Router);
  authState = inject(AuthStateService);
  jobsStore = inject(JobsStoreService);
  constructor(
    private loaderService: LoaderService
  ) {
    super();
  }

  jobService = inject(JobService);
  applicationService = inject(ApplicationService);

  jobs: JobItem[] = [];
  totalJobs = 0;
  mode: UserType = 'public';
  role: string = '';
  isSavedView = signal(false);
  isLoading = false;
  
  // Track which jobs are being processed (to disable buttons during API calls)
  applyingJobs = new Set<number>();

  // pagination
  currentPage = 1;
  totalPages = 0;

  // sort state
  sortValue = 'relevance';

  // Options for select dropdowns
  cityOptions = [
    { label: 'جميع المواقع', value: '' },
    { label: 'صنعاء', value: 'sanaa' },
    { label: 'عدن', value: 'aden' },
    { label: 'تعز', value: 'taiz' },
    { label: 'الحديدة', value: 'hodeidah' },
    { label: 'إب', value: 'ibb' },
    { label: 'المكلا', value: 'mukalla' },
    { label: 'عمل عن بُعد', value: 'remote' },
  ];

  categoryOptions = [
    { label: 'جميع الفئات', value: undefined },
    { label: 'تقنية المعلومات', value: 1 },
    { label: 'الهندسة', value: 2 },
    { label: 'التسويق', value: 3 },
  ];

  sortOptions = [
    { label: 'الأكثر صلة', value: 'relevance' },
    { label: 'الأحدث', value: 'date' },
    { label: 'الراتب', value: 'salary' },
    { label: 'اسم الشركة', value: 'company' },
  ];

  // Local search value for two-way binding
  searchValue: string = '';

  // ALL filters state - now synced with store
  get filters(): JobFilters {
    return this.jobsStore.filters;
  }

  // Sync search value with store filters
  ngOnInit() {
    this.role = localStorage.getItem('role') || '';

    // Initialize search value from store
    this.searchValue = this.jobsStore.filters.search || '';

    // Subscribe to loading state
    this.jobsStore.loading$.subscribe(loading => {
      this.isLoading = loading;
      if (loading) {
        this.loaderService.start();
      } else {
        this.loaderService.stop();
      }
    });

    // Subscribe to jobs data - this will emit immediately with cached data if available
    this.jobsStore.jobs$.subscribe({
      next: (data) => {
        this.jobs = data.jobs;
        this.totalJobs = data.totalJobs;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
        // Sync search value when filters change
        this.searchValue = data.filters.search || '';
      },
      error: (err) => {
        this.toastr.error('حدث خطأ أثناء جلب الوظائف');
        this.jobs = [];
        this.totalJobs = 0;
        this.totalPages = 0;
      }
    });

    // Load initial jobs only if not already loaded or if filters/page changed
    // The store will check internally if reload is needed
    this.jobsStore.loadJobs();
  }



  // -------- filters handlers --------

  onSearchSubmit() {
    // Use the bound searchValue
    this.jobsStore.setSearch(this.searchValue);
  }

  onCityChange(city: string | null | undefined) {
    this.jobsStore.setCity(city || undefined);
  }

  onCategoryChange(categoryId: number | undefined | null) {
    this.jobsStore.setCategory(categoryId ? Number(categoryId) : undefined);
  }

  setJobType(type: string) {
    this.jobsStore.toggleJobType(type);
  }

  navigate(slug: string) {
    const role = this.authState.role() as UserRole || '';
    if(role === 'jobseeker') {
      this.router.navigate(['/jobseeker/job-details', slug]);
    } else if(role === 'employer') {
      this.router.navigate(['/companies/job-details', slug]);
    } else {
      this.router.navigate(['/jobs', slug]);
    }
  }

  setExperienceLevel(level: string) {
    this.jobsStore.toggleExperienceLevel(level);
  }

  onSortChange(value: string) {
    this.sortValue = value;
    this.jobsStore.setSorting(value);
  }

  clearAllFilters(): void {
    this.jobsStore.clearFilters();
  }

  applyFilters(): void {
    // Filters are applied automatically when changed
    this.jobsStore.refresh();
  }

  // -------- pagination --------

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.jobsStore.goToPage(page);
  }

  previousPage(): void {
    this.jobsStore.previousPage();
  }

  nextPage(): void {
    this.jobsStore.nextPage();
  }

  // -------- other existing stuff --------

  jobTypeLabel(type: string): string {
    // comments are in English only
    switch (type) {
      case 'full_time': return 'دوام كامل';
      case 'part_time': return 'دوام جزئي';
      case 'contract': return 'عقد مؤقت';
      case 'freelance': return 'عمل حر';
      case 'internship': return 'تدريب';
      default: return type;
    }
  }

  cityLabel(city: string): string {
    // comments are in English only
    switch (city) {
      case 'sanaa': return 'صنعاء';
      case 'aden': return 'عدن';
      case 'taiz': return 'تعز';
      case 'hodeidah': return 'الحديدة';
      case 'ibb': return 'إب';
      case 'mukalla': return 'المكلا';
      case 'remote': return 'عمل عن بُعد';
      default: return city;
    }
  }

  applyToJob(job: JobItem): void {
    // Check if already applied
    if (job.is_applied) {
      this.toastr.info('لقد تقدمت بالفعل على هذه الوظيفة');
      return;
    }

    // Check if user is logged in (should check role or token)
    const token = localStorage.getItem('access');
    if (!token) {
      this.toastr.warning('يجب تسجيل الدخول أولاً');
      return;
    }

    // Prevent duplicate clicks
    if (this.applyingJobs.has(job.id)) {
      return;
    }

    this.applyingJobs.add(job.id);

    this.applicationService.applyToJob(job.id).subscribe({
      next: () => {
        // Update job state to show as applied
        job.is_applied = true;
        this.jobsStore.updateJob(job.id, { is_applied: true });
        this.applyingJobs.delete(job.id);
        this.toastr.success(`تم التقديم على الوظيفة "${job.title}" بنجاح`);
      },
      error: (err) => {
        this.applyingJobs.delete(job.id);
        console.error('Failed to apply to job', err);
        
        // Handle specific error cases
        if (err?.status === 400) {
          const errorMsg = err?.error?.message || err?.error?.job?.[0] || 'لا يمكن التقديم على هذه الوظيفة';
          this.toastr.error(errorMsg);
        } else if (err?.status === 401 || err?.status === 403) {
          this.toastr.error('يجب تسجيل الدخول أولاً');
        } else {
          this.toastr.error('حدث خطأ أثناء التقديم على الوظيفة. حاول مرة أخرى.');
        }
      }
    });
  }

  saveJob(job: JobItem): void {
    // optimistic toggle value
    const newValue = !job.is_bookmarked;

    this.jobService.bookmarkJob(job.id).subscribe({
      next: () => {
        // update UI state so button text / class change immediately
        job.is_bookmarked = newValue;
        this.jobsStore.updateJob(job.id, { is_bookmarked: newValue });

        this.toastr.success(
          newValue
            ? `تم حفظ الوظيفة ${job.id} بنجاح`
            : `تم إزالة الوظيفة ${job.id} من المحفوظات`
        );
      },
      error: () => {
        // keep old value because API failed
        this.toastr.error('تعذر حفظ الوظيفة');
      }
    });
  }


  shareJob(jobId: any, title?: string): void {
    this.toastr.success(`تم مشاركة الوظيفة ${title || jobId} بنجاح`);
  }

formatSalary(job: JobItem): string {
  const min = job.salary_min;
  const max = job.salary_max;

  if (min != null && max != null) {
    return `${min.toLocaleString()} - ${max.toLocaleString()} ريال/شهر`;
  }

  if (min != null && max == null) {
    return `من ${min.toLocaleString()} ريال/شهر`;
  }

  if (min == null && max != null) {
    return `حتى ${max.toLocaleString()} ريال/شهر`;
  }

  return 'الراتب غير محدد';
}

// English: very simple "time ago" for created_at
timeAgo(dateStr: string): string {
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'اليوم';
  }
  if (diffDays === 1) {
    return 'منذ يوم';
  }
  if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  }

  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) {
    return 'منذ أسبوع';
  }

  return `منذ ${weeks} أسابيع`;
}
}
