import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from 'shared/services/job.service';
import { ApplicationService } from 'shared/services/application.service';
import { JobItem } from '@app/companies/models';
import { SharedModule } from 'shared/shared-module';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'shared/base/base';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ApplyJobComponent } from '../apply-job/apply-job';

interface Company {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string | null;
  cover_image: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  size: string | null;
  industry: string | null;
  founded_year: number | null;
  employees_count: number | null;
  is_verified: boolean;
  is_featured: boolean;
  total_jobs: number;
  active_jobs: number;
  is_following: boolean;
  followers_count: number;
  average_rating: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  is_active: boolean;
  jobs_count: number;
}

interface CustomForm {
  id: number;
  company: number;
  name: string;
  description: string | null;
  is_active: boolean;
  questions: Array<{
    id: number;
    label: string;
    help_text: string | null;
    question_type: 'text' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date' | 'number';
    required: boolean;
    options: string | null;
    order: number;
  }>;
  questions_count?: number;
  created_at: string;
}

interface JobDetail extends Base {
  id: number;
  company: Company;
  category: Category;
  custom_form?: CustomForm | null;
  is_bookmarked: boolean;
  applications_count: number;
  is_applied: boolean;
  title: string;
  slug: string;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  benefits: string | null;
  skills: string | null;
  job_type: string;
  experience_level: string;
  education_level: string;
  city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  is_salary_negotiable: boolean;
  application_deadline: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  application_method?: 'platform' | 'custom_form' | 'template_file' | 'external_link' | 'email';
  application_template?: string | null;
  external_application_url?: string | null;
  application_email?: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_urgent: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  posted_by: number;
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    SkeletonModule,
    ApplyJobComponent,
  ],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss',
})
export class JobDetails extends Base implements OnInit {
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  jobDetail: JobDetail | null = null;
  similarJobs: JobItem[] = [];
  isLoading = false;
  isLoadingSimilar = false;
  showApplicationForm = false;
  isSubmittingApplication = false;

  // Application form model
  applicationForm = {
    full_name: '',
    email: '',
    phone: '',
    years_of_experience: '',
    cover_letter: '',
  };

  cvFile: File | null = null;
  cvFileName: string = '';

  // Experience options for dropdown
  experienceOptions = [
    { label: 'أقل من سنة', value: '0-1' },
    { label: '1-3 سنوات', value: '1-3' },
    { label: '3-5 سنوات', value: '3-5' },
    { label: 'أكثر من 5 سنوات', value: '5+' },
  ];

  ngOnInit(): void {
    const jobSlug = this.activatedRoute.snapshot.paramMap.get('slug'); // route param name = 'slug' in your example
    if (!jobSlug) {
      return;
    }

    this.isLoading = true;
    this.jobService.getJobBySlug(jobSlug).subscribe({
      next: (data: JobDetail) => {
        this.jobDetail = data;
        this.isLoading = false;
        // Load similar jobs after job detail is loaded
        if (data.id) {
          this.loadSimilarJobs(data.id);
        }
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.isLoading = false;
      },
    });
  }

  toggleApplicationForm(): void {
    this.showApplicationForm = !this.showApplicationForm;
    if (!this.showApplicationForm) {
      // Reset form when closing
      this.resetApplicationForm();
    }
  }

  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.toastr.error('حجم الملف يجب أن يكون أقل من 5MB');
      input.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('نوع الملف غير مدعوم. يرجى رفع ملف PDF أو DOC أو DOCX');
      input.value = '';
      return;
    }

    this.cvFile = file;
    this.cvFileName = file.name;
  }

  resetApplicationForm(): void {
    this.applicationForm = {
      full_name: '',
      email: '',
      phone: '',
      years_of_experience: '',
      cover_letter: '',
    };
    this.cvFile = null;
    this.cvFileName = '';
  }

  onSubmitApplication(): void {
    // Prevent multiple submissions
    if (this.isSubmittingApplication) {
      return;
    }

    if (!this.jobDetail) return;

    // Basic validation
    if (!this.applicationForm.full_name || !this.applicationForm.email || !this.applicationForm.phone) {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // if (!this.cvFile) {
    //   this.toastr.error('يرجى رفع السيرة الذاتية');
    //   return;
    // }

    this.isSubmittingApplication = true;

    // Build FormData
    const formData = new FormData();
    formData.append('job', String(this.jobDetail.id));
    formData.append('full_name', this.applicationForm.full_name);
    formData.append('email', this.applicationForm.email);
    formData.append('phone', this.applicationForm.phone);
    
    if (this.applicationForm.years_of_experience) {
      formData.append('years_of_experience', this.applicationForm.years_of_experience);
    }
    
    if (this.applicationForm.cover_letter) {
      formData.append('cover_letter', this.applicationForm.cover_letter);
    }

    if (this.cvFile) {
      formData.append('resume', this.cvFile);
    }

    this.applicationService.applyToJobWithData(formData).subscribe({
      next: () => {
        this.toastr.success('تم إرسال طلبك بنجاح!');
        this.isSubmittingApplication = false;
        this.showApplicationForm = false;
        this.resetApplicationForm();
        
        // Refresh job details to update application status
        if (this.jobDetail?.slug) {
          this.jobService.getJobBySlug(this.jobDetail.slug).subscribe({
            next: (data: JobDetail) => {
              this.jobDetail = data;
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to submit application', err);
        this.isSubmittingApplication = false;
        
        // Handle specific error messages
        
          this.errors.error(err, { join: true });
        
      },
    });
  }

  onSaveJob(): void {
    if (!this.jobDetail) return;

    const jobId = this.jobDetail.id;
    const isBookmarked = this.jobDetail.is_bookmarked;

    if (isBookmarked) {
      // Unbookmark job
      this.jobService.unbookmarkJob(jobId).subscribe({
        next: () => {
          this.toastr.success('تم إزالة الوظيفة من المحفوظات');
          // Update local state
          if (this.jobDetail) {
            this.jobDetail.is_bookmarked = false;
          }
        },
        error: (err) => {
          console.error('Failed to unbookmark job', err);
          this.toastr.error('فشل في إزالة الوظيفة من المحفوظات');
        }
      });
    } else {
      // Bookmark job
      this.jobService.bookmarkJob(jobId).subscribe({
        next: () => {
          this.toastr.success('تم حفظ الوظيفة بنجاح');
          // Update local state
          if (this.jobDetail) {
            this.jobDetail.is_bookmarked = true;
          }
        },
        error: (err) => {
          console.error('Failed to bookmark job', err);
          const errorMsg = err?.error?.message || err?.error?.detail || 'فشل في حفظ الوظيفة';
          this.toastr.error(errorMsg);
        }
      });
    }
  }

  onShareJob(): void {
    if (!this.jobDetail) return;
    
    const url = window.location.href;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: this.jobDetail.title,
        text: `تحقق من هذه الوظيفة: ${this.jobDetail.title}`,
        url: url
      }).then(() => {
        this.toastr.success('تم مشاركة الوظيفة بنجاح');
      }).catch((err) => {
        // User cancelled or error occurred, fallback to copy
        this.copyToClipboard(url);
      });
    } else {
      // Fallback to clipboard
      this.copyToClipboard(url);
    }
  }

  private copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastr.success('تم نسخ رابط الوظيفة إلى الحافظة');
      }).catch(() => {
        // Fallback for older browsers
        this.fallbackCopyToClipboard(text);
      });
    } else {
      // Fallback for older browsers
      this.fallbackCopyToClipboard(text);
    }
  }

  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.toastr.success('تم نسخ رابط الوظيفة إلى الحافظة');
    } catch (err) {
      this.toastr.error('فشل في نسخ الرابط. يرجى نسخه يدوياً');
    }
    
    document.body.removeChild(textArea);
  }

  getJobTypeLabel(type: string | null | undefined): string {
    switch (type) {
      case 'full_time':
        return 'دوام كامل';
      case 'part_time':
        return 'دوام جزئي';
      case 'remote':
        return 'عمل عن بُعد';
      case 'contract':
        return 'عقد مؤقت';
      default:
        return 'غير محدد';
    }
  }

  getExperienceLevelLabel(level: string | null | undefined): string {
    switch (level) {
      case 'junior':
        return 'مبتدئ';
      case 'mid':
      case 'mid_level':
        return 'متوسط';
      case 'senior':
        return 'خبير';
      default:
        return 'غير محدد';
    }
  }

  formatSalary(min: number | null, max: number | null): string {
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ريال`;
    }
    if (min && !max) {
      return `ابتداءً من ${min.toLocaleString()} ريال`;
    }
    if (!min && max) {
      return `حتى ${max.toLocaleString()} ريال`;
    }
    return 'غير محدد';
  }

  loadSimilarJobs(jobId: number): void {
    this.isLoadingSimilar = true;
    this.jobService.getSimilarJobs(jobId).subscribe({
      next: (jobs: JobItem[]) => {
        this.similarJobs = jobs;
        this.isLoadingSimilar = false;
      },
      error: (err) => {
        console.error('Failed to load similar jobs', err);
        this.isLoadingSimilar = false;
      },
    });
  }

  navigateToJob(slug: string): void {
    // Use /jobs/job-details/:slug for all users regardless of role
    this.router.navigate(['/jobs/job-details', slug]).then(() => {
      window.location.reload();
    });
  }

  formatSimilarJobSalary(job: JobItem): string {
    return this.formatSalary(job.salary_min, job.salary_max);
  }
}
