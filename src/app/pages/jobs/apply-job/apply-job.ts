import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationService } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from 'shared/shared-module';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Base } from 'shared/base/base';

export interface ApplicationResponse {
  question: number;
  answer_text: string | null;
  answer_file: string | null;
}

interface JobData {
  id: number;
  application_method?: 'platform' | 'custom_form' | 'template_file' | 'external_link' | 'email';
  custom_form?: {
    id: number;
    questions: Array<{
      id: number;
      label: string;
      help_text: string | null;
      question_type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date' | 'number';
      required: boolean;
      options: string | null;
      order: number;
    }>;
  } | null;
  application_template?: string | null;
  external_application_url?: string | null;
  application_email?: string | null;
}

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    DatePickerModule,
    ButtonModule,
    FileUploadModule,
    SelectModule,
  ],
  templateUrl: './apply-job.html',
  styleUrls: ['./apply-job.scss'],
})
export class ApplyJobComponent extends Base implements OnInit {
  @Input() jobId!: number;
  @Input() jobTitle?: string;
  @Input() job?: JobData;
  @Input() onClose?: () => void;

  private applicationService = inject(ApplicationService);
  private router = inject(Router);

  isSubmitting = false;
  
  get applicationMethod(): string {
    return this.job?.application_method || 'platform';
  }
  
  get customFormQuestions(): Array<{
    id: number;
    label: string;
    help_text: string | null;
    question_type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date' | 'number';
    required: boolean;
    options: string | null;
    order: number;
  }> {
    return this.job?.custom_form?.questions || [];
  }

  // Form model
  applicationForm = {
    job: 0,
    cover_letter: '',
    portfolio_url: '',
    expected_salary: null as number | null,
    availability_date: null as string | null,
    notes: '',
    responses: [] as ApplicationResponse[],
  };

  // File uploads
  resumeFile: File | null = null;
  resumeFileName: string = '';
  filledTemplateFile: File | null = null;
  filledTemplateFileName: string = '';

  // Dynamic responses (for job questions)
  jobQuestions: Array<{ id: number; text: string }> = [];
  responseFiles: Map<number, File> = new Map();
  customFormResponses: Map<number, any> = new Map();

  ngOnInit(): void {
    if (this.jobId) {
      this.applicationForm.job = this.jobId;
    }
    
    // Load custom form questions if application method is custom_form
    if (this.applicationMethod === 'custom_form' && this.customFormQuestions.length > 0) {
      this.jobQuestions = this.customFormQuestions.map(q => ({
        id: q.id,
        text: q.label
      }));
    }
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toastr.error('حجم ملف السيرة الذاتية يجب أن يكون أقل من 5MB');
      input.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('نوع الملف غير مدعوم. يرجى رفع ملف PDF أو DOC أو DOCX');
      input.value = '';
      return;
    }

    this.resumeFile = file;
    this.resumeFileName = file.name;
  }

  onFilledTemplateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toastr.error('حجم الملف المعبأ يجب أن يكون أقل من 5MB');
      input.value = '';
      return;
    }

    this.filledTemplateFile = file;
    this.filledTemplateFileName = file.name;
  }

  onResponseFileSelected(questionId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toastr.error('حجم الملف يجب أن يكون أقل من 5MB');
      input.value = '';
      return;
    }

    this.responseFiles.set(questionId, file);
  }

  removeResume(): void {
    this.resumeFile = null;
    this.resumeFileName = '';
  }

  removeFilledTemplate(): void {
    this.filledTemplateFile = null;
    this.filledTemplateFileName = '';
  }

  removeResponseFile(questionId: number): void {
    this.responseFiles.delete(questionId);
    const response = this.applicationForm.responses.find((r) => r.question === questionId);
    if (response) {
      response.answer_file = null;
    }
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    if (!this.applicationForm.job) {
      this.toastr.error('لم يتم تحديد الوظيفة');
      return;
    }

    // Handle different application methods
    if (this.applicationMethod === 'external_link') {
      if (this.job?.external_application_url) {
        window.open(this.job.external_application_url, '_blank');
        if (this.onClose) {
          this.onClose();
        }
      }
      return;
    }

    if (this.applicationMethod === 'email') {
      if (this.job?.application_email) {
        const subject = encodeURIComponent(`طلب توظيف: ${this.jobTitle || ''}`);
        const body = encodeURIComponent(`أرغب في التقديم على الوظيفة: ${this.jobTitle || ''}`);
        window.location.href = `mailto:${this.job.application_email}?subject=${subject}&body=${body}`;
        if (this.onClose) {
          this.onClose();
        }
      }
      return;
    }

    // Validate portfolio URL if provided
    if (this.applicationForm.portfolio_url && this.applicationForm.portfolio_url.length > 200) {
      this.toastr.error('رابط الأعمال يجب أن يكون أقل من 200 حرف');
      return;
    }

    // Validate custom form required fields
    if (this.applicationMethod === 'custom_form') {
      for (const question of this.customFormQuestions) {
        if (question.required) {
          const response = this.customFormResponses.get(question.id);
          if (!response || !response.answer_text?.trim()) {
            this.toastr.error(`يرجى الإجابة على السؤال: ${question.label}`);
            return;
          }
        }
      }
    }

    this.isSubmitting = true;

    // Build FormData
    const formData = new FormData();
    formData.append('job', String(this.applicationForm.job));

    if (this.applicationForm.cover_letter) {
      formData.append('cover_letter', this.applicationForm.cover_letter);
    }

    if (this.resumeFile) {
      formData.append('resume', this.resumeFile);
    }

    if (this.applicationForm.portfolio_url) {
      formData.append('portfolio_url', this.applicationForm.portfolio_url);
    }

    if (this.applicationForm.expected_salary !== null && this.applicationForm.expected_salary !== undefined) {
      formData.append('expected_salary', String(this.applicationForm.expected_salary));
    }

    if (this.applicationForm.availability_date) {
      formData.append('availability_date', this.applicationForm.availability_date);
    }

    if (this.applicationForm.notes) {
      formData.append('notes', this.applicationForm.notes);
    }

    if (this.filledTemplateFile) {
      formData.append('filled_template', this.filledTemplateFile);
    }

    // Add custom form ID and responses if application method is custom_form
    if (this.applicationMethod === 'custom_form') {
      // Add custom_form ID
      if (this.job?.custom_form?.id) {
        formData.append('custom_form', String(this.job.custom_form.id));
      }
      
      // Add responses
      if (this.customFormResponses.size > 0) {
        const responsesData: any[] = [];
        this.customFormResponses.forEach((response, questionId) => {
          responsesData.push({
            question: questionId,
            answer_text: response.answer_text || null,
            answer_file: null,
          });
        });
        if (responsesData.length > 0) {
          formData.append('responses', JSON.stringify(responsesData));
        }
      }
    } else if (this.applicationForm.responses.length > 0) {
      // Add regular responses
      const responsesData = this.applicationForm.responses.map((response) => {
        const responseData: any = {
          question: response.question,
          answer_text: response.answer_text || null,
          answer_file: null,
        };
        return responseData;
      });
      formData.append('responses', JSON.stringify(responsesData));
    }

    // Submit application
    this.applicationService.applyToJobWithData(formData).subscribe({
      next: () => {
        this.toastr.success('تم إرسال طلبك بنجاح!');
        this.isSubmitting = false;
        this.resetForm();
        // Call onClose callback if provided
        if (this.onClose) {
          this.onClose();
        }
        // Navigate back or emit event
        if (this.router.url.includes('/job-details')) {
          // Reload the page to update application status
          window.location.reload();
        }
      },
      error: (err) => {
        console.error('Failed to submit application', err);
        this.isSubmitting = false;
        this.errors.error(err, { join: true });
      },
    });
  }

  onCancel(): void {
    this.resetForm();
    if (this.onClose) {
      this.onClose();
    }
  }

  resetForm(): void {
    this.applicationForm = {
      job: this.jobId || 0,
      cover_letter: '',
      portfolio_url: '',
      expected_salary: null,
      availability_date: null,
      notes: '',
      responses: [],
    };
    this.resumeFile = null;
    this.resumeFileName = '';
    this.filledTemplateFile = null;
    this.filledTemplateFileName = '';
    this.responseFiles.clear();
  }


  // Method to add a response (if job has questions)
  addResponse(questionId: number, answerText: string): void {
    const existingIndex = this.applicationForm.responses.findIndex((r) => r.question === questionId);
    const response: ApplicationResponse = {
      question: questionId,
      answer_text: answerText || null,
      answer_file: null,
    };

    if (existingIndex >= 0) {
      this.applicationForm.responses[existingIndex] = response;
    } else {
      this.applicationForm.responses.push(response);
    }
  }

  updateResponseText(questionId: number, answerText: string): void {
    if (this.applicationMethod === 'custom_form') {
      const currentResponse = this.customFormResponses.get(questionId) || {};
      this.customFormResponses.set(questionId, {
        ...currentResponse,
        answer_text: answerText
      });
    } else {
      this.addResponse(questionId, answerText);
    }
  }

  getResponseText(questionId: number): string {
    if (this.applicationMethod === 'custom_form') {
      const response = this.customFormResponses.get(questionId);
      return response?.answer_text || '';
    } else {
      const response = this.applicationForm.responses.find((r) => r.question === questionId);
      return response?.answer_text || '';
    }
  }

  updateCustomFormResponse(questionId: number, value: any, questionType: string): void {
    const currentResponse = this.customFormResponses.get(questionId) || {};
    
    if (questionType === 'checkbox') {
      // For checkboxes, store as array
      const currentValue = currentResponse.answer_text ? JSON.parse(currentResponse.answer_text) : [];
      const index = currentValue.indexOf(value);
      if (index > -1) {
        currentValue.splice(index, 1);
      } else {
        currentValue.push(value);
      }
      this.customFormResponses.set(questionId, {
        ...currentResponse,
        answer_text: JSON.stringify(currentValue)
      });
    } else {
      this.customFormResponses.set(questionId, {
        ...currentResponse,
        answer_text: value
      });
    }
  }

  getCustomFormResponse(questionId: number, questionType: string): any {
    const response = this.customFormResponses.get(questionId);
    if (!response) return questionType === 'checkbox' ? [] : '';
    
    if (questionType === 'checkbox') {
      try {
        return response.answer_text ? JSON.parse(response.answer_text) : [];
      } catch {
        return [];
      }
    }
    return response.answer_text || '';
  }

  getSelectOptions(options: string | null): Array<{label: string; value: string}> {
    if (!options) return [];
    return options.split(',').map(o => ({label: o.trim(), value: o.trim()}));
  }
}

