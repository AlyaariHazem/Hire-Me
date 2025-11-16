import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { JobService, JobFilters, JobListResponse } from 'shared/services/job.service';
import { JobItem } from '@app/companies/models';
import { SharedModule } from 'shared/shared-module';
import { UserType } from 'core/types';

@Component({
  selector: 'app-jobs',
  imports: [SharedModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss'
})
export class Jobs {
  constructor(private toastr: ToastrService) {}

  jobService = inject(JobService);

  jobs: JobItem[] = [];
  totalJobs = 0;
  mode: UserType = 'public';

  // pagination
  currentPage = 1;
  totalPages = 0;

   // sort state
  sortValue = 'relevance';

  // ALL filters state
   filters: JobFilters = {
    search: '',
    city: undefined,
    category: undefined,
    job_type: undefined,
    experience_level: undefined,
    ordering: undefined,
    page: 1
  };

  ngOnInit() {
    this.getJobs();
    
  }

  getJobs() {
  // comments are in English only
  const requestFilters: JobFilters = {
    ...this.filters,
    page: this.currentPage,
    page_size: 5
  };

  this.jobService.getJobs(requestFilters).subscribe({
    next: (res: JobListResponse) => {
      this.jobs = res.results;
      this.totalJobs = res.count;
      this.totalPages = Math.ceil(res.count / 5);
    },
    error: () => {
      this.toastr.error('حدث خطأ أثناء جلب الوظائف');
    }
  });
}


  // -------- filters handlers --------

  onSearchSubmit() {
    // called when search form is submitted
    this.currentPage = 1;
    this.getJobs();
  }

  onCityChange(city: string) {
    this.filters.city = city as any || undefined;
    this.currentPage = 1;
    this.getJobs();
  }

  onCategoryChange(categoryId: number | undefined) {
    // backend expects integer id, empty string means no filter
    this.filters.category = categoryId ? Number(categoryId) : undefined;
    this.currentPage = 1;
    this.getJobs();
  }

  setJobType(type: string) {
    // type must be API values: full_time, part_time, ...
    this.filters.job_type = type as any;
    this.currentPage = 1;
    this.getJobs();
  }

  setExperienceLevel(level: string) {
    this.filters.experience_level = level as any;
    this.currentPage = 1;
    this.getJobs();
  }

  onSortChange(value: string) {
    // comments are in English only
    switch (value) {
      case 'date':
        this.filters.ordering = '-created_at';
        break;
      case 'salary':
        this.filters.ordering = '-salary_max';
        break;
      case 'company':
        this.filters.ordering = 'company__name';
        break;
      default:
        this.filters.ordering = undefined; // relevance or default
    }
    this.currentPage = 1;
    this.getJobs();
  }

  clearAllFilters(): void {
    this.filters = {
      search: '',
      city: undefined,
      category: undefined,
      job_type: undefined,
      experience_level: undefined,
      ordering: undefined,
      page: 1
    };
    this.currentPage = 1;
    this.getJobs();
  }

  applyFilters(): void {
    // if you later add salary/date filters, handle them here then call getJobs
    this.currentPage = 1;
    this.getJobs();
  }

  // -------- pagination --------

  get pages(): number[] {
    // comments are in English only
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getJobs();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
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

  applyToJob(jobId: any): void {
    this.toastr.success(`تم التقديم على الوظيفة ${jobId} بنجاح`);
  }

  saveJob(jobId: number): void {
  // comments are in English only
  this.jobService.bookmarkJob(jobId).subscribe({
    next: () => {
      this.toastr.success(`تم حفظ الوظيفة ${jobId} بنجاح`);
    },
    error: () => {
      this.toastr.error('تعذر حفظ الوظيفة');
    }
  });
}


  shareJob(jobId: any, title?: string): void {
    this.toastr.success(`تم مشاركة الوظيفة ${title || jobId} بنجاح`);
  }

  // you can later wire salary/date filters if backend supports them
}
