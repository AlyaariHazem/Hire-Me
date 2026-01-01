// new-job.component.ts (مختصر مع التعديلات المهمة فقط)
import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, inject } from '@angular/core';
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

@Component({
  selector: 'app-new-job',
  standalone: true,
  imports: [CommonModule, SharedModule, Select, FormsModule, ReactiveFormsModule],
  templateUrl: './new-job.html',
  styleUrls: ['./new-job.scss','./../post-job/post-job.scss'],
})
export class NewJob implements OnInit, OnChanges {
  @Input() editSlug: string | null = null;
  @Output() saved = new EventEmitter<JobItem>();

  step = 1;
  form: FormGroup;
  isSubmitting = false;

  jobCities = JOB_CITIES;
  jobTypes = JOB_TYPES;
  experienceLevels = EXPERIENCE_LEVELS;
  educationLevels = EDUCATION_LEVELS;

  categories: { id: number; label: string; slug: string }[] = [];
  companies: { id: number; name: string }[] = [];

  private api = inject(JobService);
  private companyService = inject(CompanyService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private store = inject(ManageJobsStoreService);

  get isEdit() { return !!this.editSlug; }

  constructor(private fb: FormBuilder) {
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
      is_featured: [false],
      is_urgent: [false],
      publishPlan: ['basic', Validators.required],
      terms: [false],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCompanies();
    if (this.isEdit) this.loadJobForEdit(this.editSlug!);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editSlug'] && !changes['editSlug'].firstChange) {
      if (this.editSlug) this.loadJobForEdit(this.editSlug);
      else this.resetForCreate();
    }
  }

  private loadJobForEdit(slug: string) {
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
          is_featured: !!job.is_featured,
          is_urgent: !!job.is_urgent,
          publishPlan: 'basic',
          terms: true,
        });

        this.step = 1;
      },
      error: (err) => console.error('Failed to load job', err),
    });
  }

  private resetForCreate() {
    this.form.reset({
      education_level: 'any',
      languages: { arabic: true, english: false, french: false, german: false },
      publishPlan: 'basic',
      is_salary_negotiable: false,
      is_featured: false,
      is_urgent: false,
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
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.toastr.error('فشل في تحميل فئات الوظائف');
      },
    });
  }

  private loadCompanies() {
    this.companyService.getMyCompanies().subscribe({
      next: (list) => {
        this.companies = (list ?? []).map((c: any) => ({ id: Number(c.id), name: c.name || c.slug || 'بدون اسم' }));
        const ctrl = this.form.get('company');
        if (ctrl && !ctrl.value && this.companies.length) ctrl.setValue(this.companies[0].id);
      },
      error: (err) => console.error('Failed to load companies', err),
    });
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
      1: ['title','category','job_type','city','experience_level','description'],
      2: ['requirements'],
      3: ['company'],
      4: ['publishPlan','terms'],
    };
    const names = controlsByStep[this.step] || [];
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
      1: ['title','category','job_type','city','experience_level','description'],
      2: ['requirements'],
      3: ['company'],
      4: ['publishPlan','terms'],
    };
    (groups[this.step] || []).forEach(n => this.form.get(n)?.markAsTouched());
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
      is_featured: !!v.is_featured,
      is_urgent: !!v.is_urgent,
    };

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
          this.toastr.error(err?.error?.message || 'تعذر نشر الوظيفة');
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
          this.toastr.error(err?.error?.message || 'تعذر تحديث الوظيفة');
          this.isSubmitting = false;
        },
      });
    }
  }
}
