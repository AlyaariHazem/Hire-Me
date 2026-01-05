import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobFormService, JobForm, JobFormQuestion, CreateJobFormDto } from 'shared/services/job-form.service';
import { CompanyService } from 'app/pages/companies/core/services/company.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Base } from 'shared/base/base';

@Component({
  selector: 'app-job-form-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    InputTextModule,
    TextareaModule,
    Select,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    SkeletonModule,
  ],
  templateUrl: './job-form-edit.html',
  styleUrls: ['./job-form-edit.scss'],
})
export class JobFormEditComponent extends Base implements OnInit {
  private jobFormService = inject(JobFormService);
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  formId: number | null = null;
  loading = false;
  saving = false;

  // Form data
  formData = {
    company: 0,
    name: '',
    description: '',
    is_active: true,
  };

  questions: (JobFormQuestion & { optionsArray?: string[] })[] = [];
  companyId: number | null = null;

  // Question type options
  questionTypes = [
    { label: 'نص قصير', value: 'text' },
    { label: 'نص طويل', value: 'textarea' },
    { label: 'اختيار واحد', value: 'checkbox' },
    { label: 'اختيار متعدد', value: 'select' },
    { label: 'ملف', value: 'file' },
    { label: 'تاريخ', value: 'date' },
    { label: 'رقم', value: 'number' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'create') {
      this.isEditMode = true;
      this.formId = +id;
      this.loadJobForm(this.formId);
    } else {
      this.loadCompanyInfo();
    }
  }

  private loadCompanyInfo(): void {
    this.companyService.getMyCompanies().subscribe({
      next: (companies: any[]) => {
        if (companies && companies.length > 0) {
          const company = companies[0];
          this.companyId = company.id;
          this.formData.company = company.id;
        }
      },
      error: (err: any) => {
        console.error('Failed to load company info', err);
        this.toastr.error('فشل في تحميل معلومات الشركة');
      },
    });
  }

  private loadJobForm(id: number): void {
    this.loading = true;
    this.jobFormService.getJobFormById(id).subscribe({
      next: (form: JobForm) => {
        this.formData = {
          company: form.company,
          name: form.name,
          description: form.description || '',
          is_active: form.is_active,
        };
        this.companyId = form.company;
        this.questions = form.questions
          ? [...form.questions].sort((a, b) => (a.order || 0) - (b.order || 0)).map(q => ({
              ...q,
              optionsArray: q.options && this.needsOptions(q.question_type) 
                ? q.options.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
                : []
            }))
          : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load job form', err);
        this.toastr.error('فشل في تحميل النموذج');
        this.loading = false;
        this.errors.error(err, { join: true });
        this.router.navigate(['/companies/job-forms']);
      },
    });
  }

  addQuestion(): void {
    const newQuestion: JobFormQuestion & { optionsArray?: string[] } = {
      label: '',
      help_text: '',
      question_type: 'text',
      required: false,
      options: null,
      optionsArray: [],
      order: this.questions.length + 1,
    };
    this.questions.push(newQuestion);
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
    // Reorder questions
    this.questions.forEach((q, i) => {
      q.order = i + 1;
    });
  }

  moveQuestionUp(index: number): void {
    if (index > 0) {
      const temp = this.questions[index];
      this.questions[index] = this.questions[index - 1];
      this.questions[index - 1] = temp;
      // Update orders
      this.questions.forEach((q, i) => {
        q.order = i + 1;
      });
    }
  }

  moveQuestionDown(index: number): void {
    if (index < this.questions.length - 1) {
      const temp = this.questions[index];
      this.questions[index] = this.questions[index + 1];
      this.questions[index + 1] = temp;
      // Update orders
      this.questions.forEach((q, i) => {
        q.order = i + 1;
      });
    }
  }

  needsOptions(questionType: string): boolean {
    return ['select', 'choice', 'multiple_choice'].includes(questionType);
  }

  addOption(questionIndex: number): void {
    if (!this.questions[questionIndex].optionsArray) {
      this.questions[questionIndex].optionsArray = [];
    }
    this.questions[questionIndex].optionsArray!.push('');
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    if (this.questions[questionIndex].optionsArray) {
      this.questions[questionIndex].optionsArray!.splice(optionIndex, 1);
    }
  }

  onQuestionTypeChange(questionIndex: number): void {
    const question = this.questions[questionIndex];
    if (this.needsOptions(question.question_type)) {
      // Initialize optionsArray if it doesn't exist
      if (!question.optionsArray) {
        question.optionsArray = question.options 
          ? question.options.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
          : [];
      }
    } else {
      // Clear optionsArray for non-option questions
      question.optionsArray = [];
      question.options = null;
    }
  }

  onSubmit(): void {
    if (this.saving) return;

    // Validation
    if (!this.formData.name || this.formData.name.trim().length === 0) {
      this.toastr.error('اسم النموذج مطلوب');
      return;
    }

    if (this.formData.name.length > 200) {
      this.toastr.error('اسم النموذج يجب أن يكون أقل من 200 حرف');
      return;
    }

    // Validate questions
    for (let i = 0; i < this.questions.length; i++) {
      const q = this.questions[i];
      if (!q.label || q.label.trim().length === 0) {
        this.toastr.error(`يرجى إدخال نص السؤال رقم ${i + 1}`);
        return;
      }

      if (this.needsOptions(q.question_type)) {
        const optionsArray = q.optionsArray || [];
        const validOptions = optionsArray.filter(opt => opt && opt.trim().length > 0);
        if (validOptions.length === 0) {
          this.toastr.error(`يرجى إدخال على الأقل خيار واحد للسؤال رقم ${i + 1}`);
          return;
        }
      }
    }

    this.saving = true;

    // Prepare questions data (remove id for new questions in create mode)
    const questionsData = this.questions.map((q) => {
      const questionData: any = {
        label: q.label,
        help_text: q.help_text || null,
        question_type: q.question_type,
        required: q.required,
        order: q.order,
      };
      
      // Only include options if the question type needs them
      if (this.needsOptions(q.question_type)) {
        const optionsArray = q.optionsArray || [];
        const validOptions = optionsArray.filter(opt => opt && opt.trim().length > 0);
        questionData.options = validOptions.length > 0 ? validOptions.join(',') : null;
      } else {
        questionData.options = null;
      }
      
      // Include id only in edit mode if it exists
      if (this.isEditMode && q.id) {
        questionData.id = q.id;
      }
      return questionData;
    });

    const payload: CreateJobFormDto = {
      company: this.formData.company,
      name: this.formData.name,
      description: this.formData.description || null,
      is_active: this.formData.is_active,
      questions: questionsData,
    };

    if (this.isEditMode && this.formId) {
      // Update existing form
      this.jobFormService.updateJobForm(this.formId, payload).subscribe({
        next: () => {
          this.toastr.success('تم تحديث النموذج بنجاح');
          this.saving = false;
          this.router.navigate(['/companies/job-forms']);
        },
        error: (err) => {
          console.error('Failed to update job form', err);
          this.toastr.error('فشل في تحديث النموذج');
          this.saving = false;
          this.errors.error(err, { join: true });
        },
      });
    } else {
      // Create new form
      this.jobFormService.createJobForm(payload).subscribe({
        next: () => {
          this.toastr.success('تم إنشاء النموذج بنجاح');
          this.saving = false;
          this.router.navigate(['/companies/job-forms']);
        },
        error: (err) => {
          console.error('Failed to create job form', err);
          this.toastr.error('فشل في إنشاء النموذج');
          this.saving = false;
          this.errors.error(err, { join: true });
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/companies/job-forms']);
  }
}

