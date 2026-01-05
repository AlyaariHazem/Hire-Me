import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JobFormService, JobForm, JobFormFilters } from 'shared/services/job-form.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { SkeletonModule } from 'primeng/skeleton';
import { Select } from 'primeng/select';
import { Base } from 'shared/base/base';
import { CompanyService } from 'app/pages/companies/core/services/company.service';

@Component({
  selector: 'app-job-forms-list',
  standalone: true,
  imports: [CommonModule, SharedModule, SkeletonModule, Select],
  templateUrl: './job-forms-list.html',
  styleUrls: ['./job-forms-list.scss'],
})
export class JobFormsListComponent extends Base implements OnInit {
  private jobFormService = inject(JobFormService);
  private companyService = inject(CompanyService);
  private router = inject(Router);

  jobForms: JobForm[] = [];
  loading = false;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  hasNext = false;
  hasPrevious = false;

  // Filters
  filters: JobFormFilters = {
    is_active: undefined,
    search: '',
    ordering: '-created_at',
    page: 1,
    page_size: 10,
  };

  // Company info
  companyId: number | null = null;
  companyName = '';

  // Sorting options
  sortOptions = [
    { label: 'الأحدث أولاً', value: '-created_at' },
    { label: 'الأقدم أولاً', value: 'created_at' },
    { label: 'الاسم (أ-ي)', value: 'name' },
    { label: 'الاسم (ي-أ)', value: '-name' },
    { label: 'عدد الأسئلة (الأكثر)', value: '-questions_count' },
    { label: 'عدد الأسئلة (الأقل)', value: 'questions_count' },
  ];

  ngOnInit(): void {
    this.loadCompanyInfo();
    this.loadJobForms();
  }

  private loadCompanyInfo(): void {
    this.companyService.getMyCompanies().subscribe({
      next: (companies: any[]) => {
        if (companies && companies.length > 0) {
          const company = companies[0];
          this.companyId = company.id;
          this.companyName = company.name;
          this.filters.company = company.id;
        }
      },
      error: (err: any) => {
        console.error('Failed to load company info', err);
      },
    });
  }

  loadJobForms(): void {
    this.loading = true;
    this.filters.page = this.currentPage;
    this.filters.page_size = this.pageSize;

    this.jobFormService.getJobForms(this.filters).subscribe({
      next: (response) => {
        this.jobForms = response.results || [];
        this.totalCount = response.count || 0;
        this.hasNext = !!response.next;
        this.hasPrevious = !!response.previous;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load job forms', err);
        this.toastr.error('فشل في تحميل النماذج');
        this.loading = false;
        this.errors.error(err, { join: true });
      },
    });
  }

  onSearch(searchTerm: string): void {
    this.filters.search = searchTerm || undefined;
    this.currentPage = 1;
    this.loadJobForms();
  }

  onFilterChange(filter: Partial<JobFormFilters>): void {
    this.filters = { ...this.filters, ...filter };
    this.currentPage = 1;
    this.loadJobForms();
  }

  toggleActiveFilter(): void {
    if (this.filters.is_active === undefined) {
      this.filters.is_active = true;
    } else if (this.filters.is_active === true) {
      this.filters.is_active = false;
    } else {
      this.filters.is_active = undefined;
    }
    this.currentPage = 1;
    this.loadJobForms();
  }

  getActiveFilterLabel(): string {
    if (this.filters.is_active === true) return 'نشط فقط';
    if (this.filters.is_active === false) return 'غير نشط فقط';
    return 'الكل';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalCount / this.pageSize)) {
      this.currentPage = page;
      this.loadJobForms();
    }
  }

  deleteJobForm(id: number, name: string): void {
    if (!confirm(`هل أنت متأكد من حذف النموذج "${name}"؟`)) {
      return;
    }

    this.jobFormService.deleteJobForm(id).subscribe({
      next: () => {
        this.toastr.success('تم حذف النموذج بنجاح');
        this.loadJobForms();
      },
      error: (err) => {
        console.error('Failed to delete job form', err);
        this.toastr.error('فشل في حذف النموذج');
        this.errors.error(err, { join: true });
      },
    });
  }

  editJobForm(id: number): void {
    this.router.navigate(['/companies/job-forms', id, 'edit']);
  }

  createNewForm(): void {
    this.router.navigate(['/companies/job-forms', 'create']);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'غير محدد';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onSortChange(sortValue: string): void {
    this.filters.ordering = sortValue;
    this.currentPage = 1;
    this.loadJobForms();
  }
}

