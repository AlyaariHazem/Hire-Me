import { Component, inject, signal } from '@angular/core';
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
  role:string = '';
  isSavedView = signal(false);

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
    this.role = localStorage.getItem('role') || '';
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
      console.log('hazem', this.jobs);
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
  // English: toggle job_type filter
  if (this.filters.job_type === type) {
    // English: same type clicked again, clear filter
    this.filters.job_type = undefined;
  } else {
    // English: apply new type
    this.filters.job_type = type as any;
  }

  this.currentPage = 1;
  this.getJobs();
}


  setExperienceLevel(level: string) {
  // English: toggle experience_level filter
  if (this.filters.experience_level === level) {
    // English: same level clicked again, clear filter
    this.filters.experience_level = undefined;
  } else {
    // English: apply new level
    this.filters.experience_level = level as any;
  }

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

  saveJob(job: JobItem): void {
  // optimistic toggle value
  const newValue = !job.is_bookmarked;

  this.jobService.bookmarkJob(job.id).subscribe({
    next: () => {
      // update UI state so button text / class change immediately
      job.is_bookmarked = newValue;

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
