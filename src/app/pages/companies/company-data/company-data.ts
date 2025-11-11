import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Errors } from 'shared/services/errors';
import { CompanyService } from '../core/services/company.service';
import { ICompanyData } from '@app/companies/models';
import { environment } from 'environments/environment';

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
  private companyService = inject(CompanyService);

  companies: ICompanyData[] = [];

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
    this.loadMyCompanies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  private loadMyCompanies(): void {
    this.companyService
      .getMyCompanies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          this.companies = list || [];
        },
        error: (err) => this.errors.error(err, { join: true }),
      });
  }

  // ---------- Dialog controls ----------

  openCreateDialog(): void {
    this.dialogMode = 'create';
    this.dialogTitle = 'إضافة شركة جديدة';
    this.editingCompany = null;
    this.form = this.emptyForm();
    this.logoPreview = null;
    this.dialogVisible = true;
  }

  openEditDialog(company: ICompanyData): void {
    this.dialogMode = 'edit';
    this.dialogTitle = 'تعديل بيانات الشركة';
    this.editingCompany = company;
    this.form = { ...this.emptyForm(), ...company };
    this.logoPreview = this.buildUrl(company.logo);
    this.dialogVisible = true;
  }

  closeDialog(): void {
    if (this.saving) return; // avoid closing while saving
    this.dialogVisible = false;
    this.editingCompany = null;
    this.form = this.emptyForm();
    this.logoPreview = null;
  }

  // ---------- Logo preview ----------

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result as string);
    reader.readAsDataURL(file);

    // NOTE: You still need a real upload → set form.logo to final URL after upload.
  }

  // ---------- CRUD via dialog ----------

  save(f: NgForm): void {
    if (f.invalid) return;
    this.saving = true;

    const payload: ICompanyData = { ...this.form };

    // CREATE
    if (this.dialogMode === 'create') {
      this.companyService.createCompany(payload).subscribe({
        next: (created) => {
          this.toastr.success('تم إنشاء الشركة بنجاح');
          this.saving = false;
          this.dialogVisible = false;

          if (created) {
            this.companies = [created, ...this.companies];
          } else {
            this.loadMyCompanies();
          }

          this.form = this.emptyForm();
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
    this.companyService.updateCompany(slug, payload).subscribe({
      next: (updated) => {
        this.toastr.success('تم تحديث بيانات الشركة بنجاح');
        this.saving = false;
        this.dialogVisible = false;

        if (updated) {
          this.companies = this.companies.map((c) =>
            c.id === updated.id ? updated : c
          );
        } else {
          this.loadMyCompanies();
        }

        this.editingCompany = null;
        this.form = this.emptyForm();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.saving = false;
      },
    });
  }

  deleteCompany(company: ICompanyData): void {
    if (!company.slug) return;
    if (!confirm(`هل أنت متأكد من حذف شركة "${company.name}"؟`)) return;

    this.deletingId = company.id ?? null;

    this.companyService.deleteCompany(company.slug).subscribe({
      next: () => {
        this.toastr.success('تم حذف الشركة بنجاح');
        this.deletingId = null;
        this.companies = this.companies.filter((c) => c.id !== company.id);
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.deletingId = null;
      },
    });
  }
}
