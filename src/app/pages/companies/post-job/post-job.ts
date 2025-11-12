// post-job.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'shared/shared-module';
import { Select } from 'primeng/select';

import { JobService } from 'shared/services/job.service';
import { CreateJobDto } from '@app/companies/models';
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, JOB_CITIES, JOB_TYPES, JobCity } from '@app/companies/enums';
import { CompanyService } from '../core/services/company.service';

@Component({
  selector: 'app-post-job',
  imports: [SharedModule, Select, FormsModule, ReactiveFormsModule],
  templateUrl: './post-job.html',
  styleUrls: ['./post-job.scss'],
})
export class PostJob implements OnInit {
  step = 1;
  form: FormGroup;
  companyId: number | null = 0;

  jobCities = JOB_CITIES;
  jobTypes = JOB_TYPES;
  experienceLevels = EXPERIENCE_LEVELS;
  educationLevels = EDUCATION_LEVELS;
  // map your UI select values → API enums/ids
  categories: { id: number; label: string; slug: string }[] = [];
  companyService = inject(CompanyService);
  
  companies = [] as { id: number; name: string }[];

  private loadCompanies() {
  this.companyService.getMyCompanies().subscribe({
    next: (list) => {
      // map to id + name for the select
      this.companies = (list ?? []).map(c => ({
        id: Number(c.id),
        name: c.name || c.slug || 'بدون اسم',
      }));

      // if the form has no value yet, select the first one
      if (!this.form.get('company')?.value && this.companies.length) {
        this.form.get('company')!.setValue(this.companies[0].id);
      }
    },
    error: (err) => {
      console.error('Failed to load companies', err);
    },
  });
}

  getMyCompanies() {
    this.companyService.getMyCompanies().subscribe((data) => {
      console.log('My Companies:', data);
    });
  }
  constructor(private fb: FormBuilder, private api: JobService
  ) {
  this.form = this.fb.group({
      // Step 1
      title: ['', Validators.required],
      category: [null, Validators.required], // numeric id
      job_type: [null, Validators.required], // enum string
      city: [null, Validators.required],
      experience_level: [null, Validators.required],
      salary_min: [null],
      salary_max: [null],
      is_salary_negotiable: [false],
      description: ['', Validators.required],

      // Step 2
      requirements: ['', Validators.required],
      skills: [''],
      education_level: ['any'],
      languages: this.fb.group({
        arabic: [true],
        english: [false],
        french: [false],
        german: [false],
      }),
      benefits: [''],
      responsibilities: [''],

      // Step 3
      company: [null, Validators.required], // numeric id
      companyDescription: [''],
      companySize: [''],
      companyIndustry: [''],
      contact_email: [''],
      contact_phone: [''],
      application_deadline: [''], // yyyy-MM-dd

      // Step 4
      is_featured: [false],
      is_urgent: [false],
      publishPlan: ['basic', Validators.required],
      terms: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCompanies();
  }

   private loadCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories = (res.results || [])
          .filter(c => c.is_active)
          .map(c => ({
            id: c.id,
            label: c.name,
            slug: c.slug,
          }));
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }
  // ---- Stepper logic ----
  nextStep() {
    debugger;
    const groupValid = this.currentStepGroupValid();
    if (!groupValid) {
      this.markStepAsTouched();
      return;
    }
    if (this.step < 4) this.step++;
  }
  previousStep() {
    if (this.step > 1) this.step--;
  }

  private currentStepGroupValid(): boolean {
    const controlsByStep = {
      1: [
        'title',
        'category',
        'job_type',
        'city',
        'experience_level',
        'description',
      ],
      2: ['requirements'],
      3: ['company'],
      4: ['publishPlan', 'terms'],
    } as Record<number, string[]>;

    const names = controlsByStep[this.step] || [];
    return names.every((n) => {
      const c = this.form.get(n)!;
      return c.valid || (c.markAsTouched(), false);
    });
  }
  private markStepAsTouched() {
    const groups = {
      1: [
        'title',
        'category',
        'job_type',
        'city',
        'experience_level',
        'description',
      ],
      2: ['requirements'],
      3: ['company'],
      4: ['publishPlan', 'terms'],
    } as Record<number, string[]>;
    (groups[this.step] || []).forEach((n) => this.form.get(n)?.markAsTouched());
  }

  // ---- Submit ----
  submit() {
    // final validation of all steps
    if (this.form.invalid) {
      this.step = 1;
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const langGroup = v.languages || {};
    const skills = (v.skills ?? '').trim();

    const payload: CreateJobDto = {
      title: v.title,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities || undefined,
      benefits: v.benefits || undefined,
      skills: skills || undefined,
      company: Number(v.company),
      category: Number(v.category),
      job_type: v.job_type, // must match enum in backend
      experience_level: v.experience_level, // enum
      education_level: v.education_level || undefined,
      city: v.city as JobCity,
      salary_min: v.salary_min ? Number(v.salary_min) : undefined,
      salary_max: v.salary_max ? Number(v.salary_max) : undefined,
      is_salary_negotiable: !!v.is_salary_negotiable,
      application_deadline: v.application_deadline
        ? new Date(v.application_deadline).toISOString()
        : undefined,
      contact_email: v.contact_email || undefined,
      contact_phone: v.contact_phone || undefined,
      is_featured: !!v.is_featured,
      is_urgent: !!v.is_urgent,
    };

    // Optionally: append languages to description/requirements if backend expects plain fields
    // payload.description += `\n\nLanguages: ${
    //   Object.entries(langGroup).filter(([_, on]) => on).map(([k]) => k).join(', ')
    // }`;

    this.api.createJob(payload).subscribe({
      next: () => {
        alert('تم نشر الوظيفة بنجاح ✅');
        this.form.reset({
          education_level: 'any',
          languages: { arabic: true },
        });
        this.step = 1;
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'تعذر نشر الوظيفة');
      },
    });
  }
}
