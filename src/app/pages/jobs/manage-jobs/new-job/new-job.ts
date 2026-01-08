// new-job.component.ts (مختصر مع التعديلات المهمة فقط)
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { JobService } from 'shared/services/job.service';
import { CreateJobDto, JobDetails, JobItem } from '@app/companies/models';
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, JOB_CITIES, JOB_TYPES, JobCity } from '@app/companies/enums';
import { CompanyService } from 'app/pages/companies/core/services/company.service';
import { SharedModule } from 'shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ManageJobsStoreService } from '../../services/manage-jobs.store';
import { JobFormService, JobForm } from 'shared/services/job-form.service';
import { Base } from 'shared/base/base';

@Component({
  selector: 'app-new-job',
  standalone: true,
  imports: [CommonModule, SharedModule, Select, FormsModule, ReactiveFormsModule],
  templateUrl: './new-job.html',
  styleUrls: ['./new-job.scss','./../post-job/post-job.scss'],
})
export class NewJob extends Base implements OnInit, OnChanges {
  @Input() editSlug: string | null = null;
  @Output() saved = new EventEmitter<JobItem>();

  step = 1;
  form: FormGroup;
  isSubmitting = false;
  isLoading = true;
  private categoriesLoaded = false;
  private companiesLoaded = false;
  private jobLoaded = false;
  private jobLoading = false;

  jobCities = JOB_CITIES;
  jobTypes = JOB_TYPES;
  experienceLevels = EXPERIENCE_LEVELS;
  educationLevels = EDUCATION_LEVELS;

  categories: { id: number; label: string; slug: string }[] = [];
  companies: { id: number; name: string }[] = [];
  customForms: { id: number; name: string }[] = [];
  templateFile: File | null = null;
  templateFileName: string | null = null;

  applicationMethods = [
    { value: 'platform', label: 'النظام الافتراضي للمنصة' },
    { value: 'custom_form', label: 'استبيان مخصص' },
    { value: 'template_file', label: 'قالب ملف' },
    { value: 'external_link', label: 'رابط خارجي' },
    { value: 'email', label: 'بريد الشركة' }
  ];

  private api = inject(JobService);
  private companyService = inject(CompanyService);
  private jobFormService = inject(JobFormService);
  // private toastr = inject(ToastrService);
  private router = inject(Router);
  private store = inject(ManageJobsStoreService);
  private cdr = inject(ChangeDetectorRef);

  get isEdit() { return !!this.editSlug; }
  get selectedApplicationMethod() { return this.form.get('application_method')?.value; }

  constructor(private fb: FormBuilder) {
    super();
    this.form = this.fb.group({
      title: ['', Validators.required],
      category: [null, Validators.required],
      job_type: [null, Validators.required],
      city: [null, Validators.required],
      experience_level: [null, Validators.required],
      salary_min: [null],
      salary_max: [null],
      is_salary_negotiable: [false],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      skills: [''],
      education_level: ['any'],
      languages: this.fb.group({ arabic: [true], english: [false], french: [false], german: [false] }),
      benefits: [''],
      responsibilities: [''],
      company: [null, Validators.required],
      companyDescription: [''],
      companySize: [''],
      companyIndustry: [''],
      contact_email: [''],
      contact_phone: [''],
      application_deadline: [''],
      application_method: ['platform', Validators.required],
      custom_form: [null],
      application_template: [''],
      external_application_url: [''],
      application_email: [''],
      is_featured: [false],
      is_urgent: [false],
      is_ai_summary_enabled: [false],
      publishPlan: ['basic', Validators.required],
      terms: [false],
    });

    // Watch for application_method changes to update validators
    this.form.get('application_method')?.valueChanges.subscribe(method => {
      this.updateApplicationMethodValidators(method);
      // Clear template file if method changes away from template_file
      if (method !== 'template_file') {
        this.templateFile = null;
        this.templateFileName = null;
        const templateCtrl = this.form.get('application_template');
        templateCtrl?.setValue(null);
      }
    });

    // Watch for is_ai_summary_enabled changes to update description validators
    this.form.get('is_ai_summary_enabled')?.valueChanges.subscribe(enabled => {
      this.updateDescriptionValidators(enabled);
    });

    // Watch for company changes to reload custom forms
    this.form.get('company')?.valueChanges.subscribe(companyId => {
      if (companyId) {
        this.loadCustomForms(companyId);
      } else {
        this.customForms = [];
      }
    });
  }

  private updateApplicationMethodValidators(method: string) {
    const customFormCtrl = this.form.get('custom_form');
    const templateCtrl = this.form.get('application_template');
    const externalUrlCtrl = this.form.get('external_application_url');
    const emailCtrl = this.form.get('application_email');

    // Reset all validators
    customFormCtrl?.clearValidators();
    templateCtrl?.clearValidators();
    externalUrlCtrl?.clearValidators();
    emailCtrl?.clearValidators();

    // Set validators based on method
    if (method === 'custom_form') {
      customFormCtrl?.setValidators(Validators.required);
    } else if (method === 'template_file') {
      templateCtrl?.setValidators(Validators.required);
    } else if (method === 'external_link') {
      externalUrlCtrl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/i)]);
    } else if (method === 'email') {
      emailCtrl?.setValidators([Validators.required, Validators.email]);
    }

    // Update validity
    customFormCtrl?.updateValueAndValidity();
    templateCtrl?.updateValueAndValidity();
    externalUrlCtrl?.updateValueAndValidity();
    emailCtrl?.updateValueAndValidity();
  }

  private updateDescriptionValidators(aiSummaryEnabled: boolean) {
    const descriptionCtrl = this.form.get('description');
   
  }

  onTemplateFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    
    if (file) {
      this.templateFile = file;
      this.templateFileName = file.name;
      // Mark the control as touched and set value to indicate file is selected
      const templateCtrl = this.form.get('application_template');
      templateCtrl?.setValue(file.name);
      templateCtrl?.markAsTouched();
      templateCtrl?.updateValueAndValidity();
    } else {
      this.templateFile = null;
      this.templateFileName = null;
      const templateCtrl = this.form.get('application_template');
      templateCtrl?.setValue(null);
      templateCtrl?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCompanies();
    // Load custom forms after company is selected (handled by valueChanges)
    // Load job if editSlug is set on init
    if (this.isEdit && this.editSlug && !this.jobLoading) {
      this.loadJobForEdit(this.editSlug);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editSlug'] && !changes['editSlug'].firstChange) {
      if (this.editSlug && !this.jobLoading) {
        this.loadJobForEdit(this.editSlug);
      } else if (!this.editSlug) {
        this.jobLoaded = false;
        this.jobLoading = false;
        this.resetForCreate();
      }
    }
  }

  private loadJobForEdit(slug: string) {
    if (this.jobLoading) return; // Prevent duplicate calls
    this.jobLoading = true;
    
    this.api.getJobBySlug(slug).subscribe({
      next: (job: JobDetails) => {
        const companyId = typeof job.company === 'number' ? job.company : job.company?.id ?? null;
        const categoryId = typeof job.category === 'number' ? job.category : job.category?.id ?? null;

        this.form.patchValue({
          title: job.title ?? '',
          category: categoryId,
          job_type: job.job_type ?? null,
          city: job.city ?? null,
          experience_level: job.experience_level ?? null,
          salary_min: job.salary_min ?? null,
          salary_max: job.salary_max ?? null,
          is_salary_negotiable: !!job.is_salary_negotiable,
          description: (job as any).description ?? '',
          requirements: (job as any).requirements ?? '',
          skills: (job as any).skills ?? '',
          education_level: (job as any).education_level ?? 'any',
          benefits: (job as any).benefits ?? '',
          responsibilities: (job as any).responsibilities ?? '',
          company: companyId,
          contact_email: (job as any).contact_email ?? '',
          contact_phone: (job as any).contact_phone ?? '',
          application_deadline: job.application_deadline ? job.application_deadline.substring(0, 10) : '',
          application_method: (job as any).application_method ?? 'platform',
          custom_form: (job as any).custom_form ?? null,
          application_template: (job as any).application_template ?? '',
          external_application_url: (job as any).external_application_url ?? '',
          application_email: (job as any).application_email ?? '',
          is_featured: !!job.is_featured,
          is_urgent: !!job.is_urgent,
          is_ai_summary_enabled: !!(job as any).is_ai_summary_enabled,
          publishPlan: 'basic',
          terms: true,
        });

        // Load custom forms for the selected company
        if (companyId) {
          this.loadCustomForms(companyId);
        }

        // Update description validators based on AI summary enabled state
        this.updateDescriptionValidators(!!(job as any).is_ai_summary_enabled);

        this.step = 1;
        this.jobLoaded = true;
        this.jobLoading = false;
        // Check if loading is complete (categories, companies, and job are all loaded)
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load job', err);
        this.errors.error(err, { join: true });
        this.jobLoaded = true; // Mark as loaded even on error to prevent retry loops
        this.jobLoading = false;
        // Still check loading complete so form can be shown even if job load failed
        this.checkLoadingComplete();
      },
    });
  }

  private resetForCreate() {
    this.jobLoaded = false;
    this.jobLoading = false;
    this.templateFile = null;
    this.templateFileName = null;
    this.form.reset({
      education_level: 'any',
      languages: { arabic: true, english: false, french: false, german: false },
      publishPlan: 'basic',
      application_method: 'platform',
      is_salary_negotiable: false,
      is_featured: false,
      is_urgent: false,
      is_ai_summary_enabled: false,
      terms: false,
    });
    this.step = 1;
  }

  private loadCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        // Handle both response formats: direct array or { results: [...] }
        const categoriesArray = Array.isArray(res) ? res : (res.results || []);
        this.categories = categoriesArray
          .filter((c: any) => c.is_active)
          .map((c: any) => ({ id: c.id, label: c.name, slug: c.slug }));
        this.categoriesLoaded = true;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.errors.error(err, { join: true });
        this.categoriesLoaded = true;
        this.checkLoadingComplete();
      },
    });
  }

  private loadCompanies() {
    this.companyService.getMyCompanies().subscribe({
      next: (list) => {
        this.companies = (list ?? []).map((c: any) => ({ id: Number(c.id), name: c.name || c.slug || 'بدون اسم' }));
        const ctrl = this.form.get('company');
        if (ctrl && !ctrl.value && this.companies.length) ctrl.setValue(this.companies[0].id);
        this.companiesLoaded = true;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Failed to load companies', err);
        this.companiesLoaded = true;
        this.checkLoadingComplete();
      },
    });
  }

  private loadCustomForms(companyId?: number) {
    const filters: any = { is_active: true };
    if (companyId) {
      filters.company = companyId;
    }
    
    this.jobFormService.getJobForms(filters).subscribe({
      next: (res) => {
        this.customForms = (res.results || []).map((f: JobForm) => ({ id: f.id, name: f.name }));
      },
      error: (err) => {
        console.error('Failed to load custom forms', err);
        this.errors.error(err, { join: true });
        this.customForms = [];
      },
    });
  }

  private checkLoadingComplete() {
    // Hide skeleton when all required data is loaded
    // For edit mode: need categories, companies, AND job data
    // For create mode: only need categories and companies
    const allBasicDataLoaded = this.categoriesLoaded && this.companiesLoaded;
    
    // In create mode, we don't need job data, so jobDataReady is always true
    // In edit mode, we need job data to be loaded
    const jobDataReady = !this.isEdit || this.jobLoaded;
    
    console.log('checkLoadingComplete check:', {
      categoriesLoaded: this.categoriesLoaded,
      companiesLoaded: this.companiesLoaded,
      jobLoaded: this.jobLoaded,
      jobLoading: this.jobLoading,
      isEdit: this.isEdit,
      allBasicDataLoaded,
      jobDataReady,
      currentIsLoading: this.isLoading,
      shouldHide: allBasicDataLoaded && jobDataReady && !this.jobLoading
    });
    
    // Only hide loading if:
    // 1. Basic data (categories & companies) is loaded
    // 2. Job data is ready (either not needed in create mode, or loaded in edit mode)
    // 3. Not currently loading job data
    if (allBasicDataLoaded && jobDataReady && !this.jobLoading) {
      console.log('Hiding loading skeleton...');
      // Use setTimeout to ensure UI updates properly
      setTimeout(() => {
        this.isLoading = false;
        console.log('isLoading set to false, form should be visible');
        this.cdr.detectChanges(); // Force change detection
      }, 200);
    } else {
      console.log('Still loading, conditions not met');
    }
  }

  nextStep() {
    if (!this.currentStepGroupValid()) {
      this.markStepAsTouched();
      return;
    }
    if (this.step < 4) this.step++;
  }

  previousStep() {
    if (this.step > 1) this.step--;
  }

  private currentStepGroupValid(): boolean {
    const controlsByStep: Record<number, string[]> = {
      1: ['title','category','job_type','city','experience_level'],
      2: ['requirements'],
      3: ['company', 'application_method'],
      4: ['publishPlan','terms'],
    };
    const names = controlsByStep[this.step] || [];
    const method = this.selectedApplicationMethod;
    const aiSummaryEnabled = this.form.get('is_ai_summary_enabled')?.value;
    
    // Add description to step 1 validation only if AI summary is not enabled (description is required)
    // When AI summary is enabled, description is optional so we don't need to validate it
    if (this.step === 1 && !aiSummaryEnabled) {
      names.push('description');
    }
    
    // Add conditional validators for step 3
    if (this.step === 3) {
      if (method === 'custom_form') {
        names.push('custom_form');
      } else if (method === 'template_file') {
        names.push('application_template');
      } else if (method === 'external_link') {
        names.push('external_application_url');
      } else if (method === 'email') {
        names.push('application_email');
      }
    }
    
    return names.every(n => {
      const c = this.form.get(n);
      if (!c) return true;
      if (c.valid) return true;
      c.markAsTouched();
      return false;
    });
  }

  private markStepAsTouched() {
    const groups: Record<number, string[]> = {
      1: ['title','category','job_type','city','experience_level'],
      2: ['requirements'],
      3: ['company', 'application_method'],
      4: ['publishPlan','terms'],
    };
    const names = groups[this.step] || [];
    const method = this.selectedApplicationMethod;
    const aiSummaryEnabled = this.form.get('is_ai_summary_enabled')?.value;
    
    // Add description to step 1 only if AI summary is not enabled (description is required)
    // When AI summary is enabled, description is optional so we don't need to mark it as touched
    if (this.step === 1 && !aiSummaryEnabled) {
      names.push('description');
    }
    
    // Add conditional fields for step 3
    if (this.step === 3) {
      if (method === 'custom_form') {
        names.push('custom_form');
      } else if (method === 'template_file') {
        names.push('application_template');
      } else if (method === 'external_link') {
        names.push('external_application_url');
      } else if (method === 'email') {
        names.push('application_email');
      }
    }
    
    names.forEach(n => this.form.get(n)?.markAsTouched());
  }

  submit() {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      this.step = 1;
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const v = this.form.value;
    const payload: CreateJobDto = {
      title: v.title,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities || undefined,
      benefits: v.benefits || undefined,
      skills: (v.skills ?? '').trim() || undefined,
      company: Number(v.company),
      category: Number(v.category),
      job_type: v.job_type,
      experience_level: v.experience_level,
      education_level: v.education_level || undefined,
      city: v.city as JobCity,
      salary_min: v.salary_min ? Number(v.salary_min) : undefined,
      salary_max: v.salary_max ? Number(v.salary_max) : undefined,
      is_salary_negotiable: !!v.is_salary_negotiable,
      application_deadline: v.application_deadline ? new Date(v.application_deadline).toISOString() : undefined,
      contact_email: v.contact_email || undefined,
      contact_phone: v.contact_phone || undefined,
      application_method: v.application_method || 'platform',
      is_featured: !!v.is_featured,
      is_urgent: !!v.is_urgent,
      is_ai_summary_enabled: !!v.is_ai_summary_enabled,
    };

    // Only add conditional application method fields if they have valid values
    if (v.application_method === 'custom_form' && v.custom_form) {
      payload.custom_form = Number(v.custom_form);
    }
    if (v.application_method === 'template_file' && this.templateFile) {
      // File will be sent via FormData
    } else if (v.application_method === 'template_file' && v.application_template?.trim()) {
      payload.application_template = v.application_template.trim();
    }
    if (v.application_method === 'external_link' && v.external_application_url?.trim()) {
      payload.external_application_url = v.external_application_url.trim();
    }
    if (v.application_method === 'email' && v.application_email?.trim()) {
      payload.application_email = v.application_email.trim();
    }

    // If there's a template file, send as FormData
    if (v.application_method === 'template_file' && this.templateFile) {
      const formData = new FormData();
      // Append all payload fields to FormData
      formData.append('title', payload.title);
      formData.append('description', payload.description);
      formData.append('requirements', payload.requirements);
      if (payload.responsibilities) formData.append('responsibilities', payload.responsibilities);
      if (payload.benefits) formData.append('benefits', payload.benefits);
      if (payload.skills) formData.append('skills', payload.skills);
      formData.append('company', String(payload.company));
      formData.append('category', String(payload.category));
      formData.append('job_type', payload.job_type);
      formData.append('experience_level', payload.experience_level);
      if (payload.education_level) formData.append('education_level', payload.education_level);
      formData.append('city', payload.city);
      if (payload.salary_min !== undefined) formData.append('salary_min', String(payload.salary_min));
      if (payload.salary_max !== undefined) formData.append('salary_max', String(payload.salary_max));
      formData.append('is_salary_negotiable', String(payload.is_salary_negotiable));
      if (payload.application_deadline) formData.append('application_deadline', payload.application_deadline);
      if (payload.contact_email) formData.append('contact_email', payload.contact_email);
      if (payload.contact_phone) formData.append('contact_phone', payload.contact_phone);
      formData.append('application_method', payload.application_method || 'platform');
      if (payload.custom_form) formData.append('custom_form', String(payload.custom_form));
      if (payload.external_application_url) formData.append('external_application_url', payload.external_application_url);
      if (payload.application_email) formData.append('application_email', payload.application_email);
      formData.append('is_featured', String(payload.is_featured));
      formData.append('is_urgent', String(payload.is_urgent));
      formData.append('is_ai_summary_enabled', String(payload.is_ai_summary_enabled));
      // Append the file
      formData.append('application_template_file', this.templateFile);

      if (!this.isEdit) {
        this.api.createJobFormData(formData).subscribe({
          next: (created) => {
            this.toastr.success('تم نشر الوظيفة بنجاح ✅');
            this.store.refresh();
            this.router.navigate(['/companies/manage-jobs']);
            this.saved.emit(created); 
            this.resetForCreate();
            this.isSubmitting = false;
          },
          error: (err) => { 
            console.error(err); 
            this.errors.error(err, { join: true });
            this.isSubmitting = false;
          },
        });
      } else {
        this.api.updateJobFormData(this.editSlug!, formData).subscribe({
          next: (updated) => { 
            this.toastr.success('تم تحديث الوظيفة بنجاح ✅'); 
            this.store.refresh();
            this.router.navigate(['/companies/manage-jobs']);
            this.saved.emit(updated);
            this.isSubmitting = false;
          },
          error: (err) => { 
            console.error(err); 
            this.errors.error(err, { join: true });
            this.isSubmitting = false;
          },
        });
      }
      return;
    }

    if (!this.isEdit) {
      this.api.createJob(payload).subscribe({
        next: (created) => {
          this.toastr.success('تم نشر الوظيفة بنجاح ✅');
          this.store.refresh();
          this.router.navigate(['/companies/manage-jobs']);
          this.saved.emit(created); 
          this.resetForCreate();
          this.isSubmitting = false;
        },
        error: (err) => { 
          console.error(err); 
          this.errors.error(err, { join: true });
          this.isSubmitting = false;
        },
      });
    } else {
      this.api.updateJob(this.editSlug!, payload).subscribe({
        next: (updated) => { 
          this.toastr.success('تم تحديث الوظيفة بنجاح ✅'); 
          this.store.refresh();
          this.router.navigate(['/companies/manage-jobs']);
          this.saved.emit(updated);
          this.isSubmitting = false;
        },
        error: (err) => { 
          console.error(err); 
          this.errors.error(err, { join: true });
          this.isSubmitting = false;
        },
      });
    }
  }
}
