import { Component, OnDestroy, OnInit, inject, computed, effect } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Errors } from 'shared/services/errors';
import { CompanyService } from '../core/services/company.service';
import { CompanyDataStoreService } from '../services/company-data.store';
import { ICompanyData } from '@app/companies/models';
import { environment } from 'environments/environment';
import { COMPANY_SIZES, INDUSTRY_TYPES } from '@app/companies/enums';

@Component({
  selector: 'app-company-data',
  standalone: false,
  templateUrl: './company-data.html',
  styleUrls: ['./company-data.scss'],
})
export class CompanyData implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
   baseUrl = environment.apiBaseUrl;
  private errors = inject(Errors);
  private toastr = inject(ToastrService);
  private confirmationService = inject(ConfirmationService);
  private store = inject(CompanyDataStoreService);

  // Signals from store
  filteredCompanies = this.store.filteredCompanies;
  loading = this.store.loading;
  maxYear = this.store.maxYear;
  // Default placeholder image as data URI
  readonly defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NDk4YjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Yp9mE2YLYp9mE2YI8L3RleHQ+PC9zdmc+';

  INDUSTRY_TYPES = INDUSTRY_TYPES;
  COMPANY_SIZES = COMPANY_SIZES;

  // table state
  globalFilterValue = '';
  filterIndustry: string | null = null;
  filterSize: string | null = null;
  // dialog state
  dialogVisible = false;
  dialogMode: 'create' | 'edit' = 'create';
  dialogTitle = '';
  editingCompany: ICompanyData | null = null;

  form: ICompanyData = this.emptyForm();
  logoPreview: string | null = null;

  saving = false;
  deletingId: number | null = null;

  ngOnInit(): void {
    this.store.init();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }

  // ---------- Helpers ----------

  private emptyForm(): ICompanyData {
    return {
      name: '',
      description: '',
      website: '',
      industry: '',
      size: '',
      founded_year: null,
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      logo: '',
      cover_image: '',
      employees_count: null,
    };
  }

  private buildUrl(path?: string | null): string | null {
    if (!path) return null;
    return path.startsWith('http') ? path : environment.apiBaseUrl + path;
  }

  // Helper load method removed. Store handles it.

  // ---------- Filtering ----------

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.globalFilterValue = input.value;
    this.store.setSearchFilter(input.value);
  }

  applyFilters(): void {
     // Handled by store, but kept for method binding compatibility if needed, 
     // though we should invoke store methods directly where possible.
     this.store.setIndustryFilter(this.filterIndustry);
     this.store.setSizeFilter(this.filterSize);
  }

  getIndustryLabel(value: string): string {
    const industry = this.INDUSTRY_TYPES.find(i => i.value === value);
    return industry ? industry.label : value;
  }

  getSizeLabel(value: string): string {
    const size = this.COMPANY_SIZES.find(s => s.value === value);
    return size ? size.label : value;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.defaultPlaceholder;
    }
  }

  getCompanyLogo(logo: string | null | undefined): string {
    if (!logo) return this.defaultPlaceholder;
    if (logo.startsWith('http') || logo.startsWith('blob:') || logo.startsWith('data:')) {
      return logo;
    }
    return `${this.baseUrl.replace(/\/+$/, '')}/${logo.replace(/^\/+/, '')}`;
  }

  // ---------- Dialog controls ----------

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.dialogTitle = 'إضافة شركة جديدة';
    this.editingCompany = null;
    this.form = this.emptyForm();
    this.logoPreview = null;
    this.dialogVisible = true;
    document.body.style.overflow = 'hidden';
  }

  openEditDialog(company: ICompanyData): void {
    this.dialogMode = 'edit';
    this.dialogTitle = 'تعديل بيانات الشركة';
    this.editingCompany = company;
    this.form = { ...this.emptyForm(), ...company };
    this.logoPreview = this.buildUrl(company.logo);
    this.dialogVisible = true;
    document.body.style.overflow = 'hidden';
  }

  closeDialog(): void {
    if (this.saving) return; // avoid closing while saving
    this.dialogVisible = false;
    this.editingCompany = null;
    this.form = this.emptyForm();
    this.logoPreview = null;
    this.selectedLogoFile = null;
    this.selectedCoverFile = null;
    document.body.style.overflow = '';
  }

  // ---------- Logo preview ----------

  selectedLogoFile: File | null = null;
  selectedCoverFile: File | null = null;

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedLogoFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  onCoverSelected(evt: Event): void {
      const input = evt.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
  
      this.selectedCoverFile = file;
  }

  // ---------- CRUD via dialog ----------

  save(f: NgForm): void {
     if (f.invalid) return;

      // guard: enforce enum values
      const industryOk = this.INDUSTRY_TYPES.some(i => i.value === this.form.industry);
      const sizeOk     = this.COMPANY_SIZES.some(s => s.value === this.form.size);

      if (!industryOk) { this.toastr.error('اختر مجال عمل صحيح'); return; }
      if (!sizeOk)     { this.toastr.error('اختر حجم شركة صحيح'); return; }

      this.saving = true;

    const formData = new FormData();
    
    // Helper to append if value exists
    const appendIf = (key: string, val: any) => {
        if (val !== null && val !== undefined && val !== '') {
            formData.append(key, val);
        }
    };

    appendIf('name', this.form.name);
    appendIf('description', this.form.description);
    appendIf('website', this.form.website);
    appendIf('industry', this.form.industry);
    appendIf('size', this.form.size);
    appendIf('founded_year', this.form.founded_year);
    appendIf('email', this.form.email);
    appendIf('phone', this.form.phone);
    appendIf('country', this.form.country);
    appendIf('city', this.form.city);
    appendIf('address', this.form.address);
    appendIf('employees_count', this.form.employees_count !== null ? String(this.form.employees_count) : '');

    // Append files if selected
    if (this.selectedLogoFile) {
        formData.append('logo', this.selectedLogoFile);
    }
    
    if (this.selectedCoverFile) {
        formData.append('cover_image', this.selectedCoverFile);
    }


    // CREATE
    if (this.dialogMode === 'create') {
      this.store.createCompany(formData).subscribe({
        next: (created) => {
          this.toastr.success('تم إنشاء الشركة بنجاح');
          this.saving = false;
          this.closeDialog();
        },
        error: (err) => {
          this.errors.error(err, { join: true });
          this.saving = false;
        },
      });
      return;
    }

    // UPDATE
    if (!this.editingCompany || !this.editingCompany.slug) {
      this.toastr.error('تعذر تحديد الشركة المراد تحديثها');
      this.saving = false;
      return;
    }

    const slug = this.editingCompany.slug;
    this.store.updateCompany(slug, formData).subscribe({
      next: (updated) => {
        this.toastr.success('تم تحديث بيانات الشركة بنجاح');
        // ensure table reflects latest data from API (handles backend transformations)
        this.store.refresh();
        this.saving = false;
        this.closeDialog();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.saving = false;
      },
    });
  }

  deleteCompany(company: ICompanyData): void {
    if (!company.slug) return;

    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف شركة "${company.name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.deletingId = company.id ?? null;
        this.store.deleteCompany(company.slug!, company.id!).subscribe({
          next: () => {
            this.toastr.success('تم حذف الشركة بنجاح');
            this.deletingId = null;
          },
          error: (err) => {
            this.errors.error(err, { join: true });
            this.deletingId = null;
          },
        });
      }
    });
  }
}
