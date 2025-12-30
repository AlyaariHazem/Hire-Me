// profile.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ProfileService } from '../services/profile.service';
import { filter, takeUntil } from 'rxjs/operators';
import { ProfileStoreService } from 'shared/services/profile.service';
import { Base } from 'shared/base/base';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile extends Base implements OnInit, OnDestroy {
  constructor() {
    super();
  }

  basicForm!: FormGroup;
  jobForm!: FormGroup;

  selectedFile: File | null = null; // avatar
  selectedResume: File | null = null; // resume

  resumeUrl: string | null = null;
  resumeSafeUrl: SafeResourceUrl | null = null;
  isPdf = false;
  isResumeFromApi = false; // Track if resume is from API (external domain)
  private toRevoke: string | null = null;
  showPreview = false;
  isSaving = false;

  // Date of birth as Date object for PrimeNG Calendar
  dateOfBirthDate: Date | null = null;

  // Options for select dropdowns
  experienceLevelOptions = [
    { label: 'مبتدئ', value: 'entry' },
    { label: 'متوسط', value: 'mid' },
    { label: 'متقدم', value: 'senior' },
    { label: 'خبير', value: 'lead' },
  ];

  educationLevelOptions = [
    { label: 'ثانوية عامة', value: 'high_school' },
    { label: 'دبلوم', value: 'diploma' },
    { label: 'بكالوريوس', value: 'bachelor' },
    { label: 'ماجستير', value: 'master' },
    { label: 'دكتوراه', value: 'phd' },
  ];

  jobTypeOptions = [
    { label: 'دوام كامل', value: 'full_time' },
    { label: 'دوام جزئي', value: 'part_time' },
    { label: 'عقد مؤقت', value: 'contract' },
    { label: 'عمل حر', value: 'freelance' },
    { label: 'عن بُعد', value: 'remote' },
  ];

  availabilityOptions = [
    { label: 'نعم', value: true },
    { label: 'لا', value: false },
  ];

  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private profileApi = inject(ProfileService); // used for PUT/PATCH
  // private toastr = inject(ToastrService);
  private sanitizer = inject(DomSanitizer);
  private store = inject(ProfileStoreService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.basicForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      date_of_birth: [''],
      profile_picture: [''],
      bio: [''],
      location: [''],
    });

    this.jobForm = this.fb.group({
      resume: [''],
      experience_level: ['entry', Validators.required],
      education_level: ['high_school', Validators.required],
      skills: [''],
      expected_salary_min: [null],
      expected_salary_max: [null],
      availability: [true],
      preferred_job_type: ['full_time'],
      languages: [''],
    });

    // English: trigger initial load from the store
    // this.store.ensureLoaded();

    // English: bind once to store and patch forms
    this.store.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is any => !!p)
      )
      .subscribe((js) => {
        const u = js.user ?? {};

        // basic form
        const dateStr = this.normalizeDateForInput(u.date_of_birth);
        this.dateOfBirthDate = dateStr ? new Date(dateStr) : null;
        
        this.basicForm.patchValue({
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          email: u.email || '',
          phone: u.phone || '',
          date_of_birth: dateStr,
          profile_picture: u.profile_picture || '',
          bio: u.bio || '',
          location: u.location || '',
        });

        // job form
        this.jobForm.patchValue({
          resume: js.resume || '',
          experience_level: js.experience_level || 'entry',
          education_level: js.education_level || 'high_school',
          skills: js.skills || '',
          expected_salary_min: js.expected_salary_min ?? null,
          expected_salary_max: js.expected_salary_max ?? null,
          availability:
            typeof js.availability === 'boolean' ? js.availability : true,
          preferred_job_type: js.preferred_job_type || 'full_time',
          languages: js.languages || '',
        });

        // resume preview
        const abs = this.toAbsolute(js.resume);
        if (abs) this.setResumePreview(abs);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toRevoke) URL.revokeObjectURL(this.toRevoke);
  }

  // ---------------- File handlers ----------------
  get resumeDisplayName(): string {
    if (this.selectedResume?.name) return this.selectedResume.name;
    if (this.resumeUrl) {
      try { return decodeURIComponent(this.resumeUrl.split('/').pop() || 'السيرة الذاتية'); }
      catch { return 'السيرة الذاتية'; }
    }
    return 'السيرة الذاتية';
  }
  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  onResumeChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedResume = file;
    if (this.toRevoke) {
      URL.revokeObjectURL(this.toRevoke);
      this.toRevoke = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      this.setResumePreview(url, file.name);
      this.toRevoke = url;
    } else {
      this.clearResumePreview();
    }
  }

  // ---------------- Save ----------------
  saveChanges(): void {
    // Prevent multiple submissions
    if (this.isSaving) {
      return;
    }

    if (this.basicForm.invalid || this.jobForm.invalid) {
      this.toastr.error('تحقق من الحقول المطلوبة');
      return;
    }

    this.isSaving = true;

    // BASIC
    const b = this.basicForm.value;
    // Use dateOfBirthDate if available, otherwise use form value
    const dobValue = this.dateOfBirthDate || b.date_of_birth;
    const dob = this.normalizeDateForApi(dobValue);
    if (b.date_of_birth && !dob) {
      this.toastr.error('صيغة التاريخ يجب أن تكون YYYY-MM-DD');
      return;
    }

    interface BasicPayload {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      date_of_birth?: string;
      bio?: string;
      location?: string;
    }

    const basicPayload: BasicPayload = {
      first_name: b.first_name,
      last_name: b.last_name,
      email: b.email,
    };
    if (b.phone) basicPayload.phone = b.phone;
    if (dob) basicPayload.date_of_birth = dob;
    if (b.bio) basicPayload.bio = b.bio;
    if (b.location) basicPayload.location = b.location;

    const saveBasic$ = (() => {
      if (this.selectedFile) {
        const fd = new FormData();
        Object.entries(basicPayload).forEach(([k, v]) =>
          fd.append(k, String(v))
        );
        fd.append('profile_picture', this.selectedFile);
        return this.profileApi.updateBasicFormData(fd);
      } else {
        return this.profileApi.updateBasic(basicPayload);
      }
    })();

    saveBasic$.subscribe({
      next: () => {
        // JOB SEEKER
        const j = this.jobForm.value;
        const jobFd = new FormData();
        const jobEntries: Record<string, any> = {
          experience_level: j.experience_level,
          education_level: j.education_level,
          skills: j.skills,
          expected_salary_min: j.expected_salary_min,
          expected_salary_max: j.expected_salary_max,
          availability: j.availability,
          preferred_job_type: j.preferred_job_type,
          languages: j.languages,
        };
        Object.entries(jobEntries).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '') return;
          jobFd.append(
            k,
            typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v)
          );
        });
        if (this.selectedResume) jobFd.append('resume', this.selectedResume);

        this.profileApi.updateJobSeekerFormData(jobFd).subscribe({
          next: () => {
            this.toastr.success('تم حفظ التغييرات بنجاح');
            // English: refresh store so the latest data propagates across the app
            this.store.refresh();
            this.isSaving = false;
          },
          error: (e) => {
            this.handleErr(e, 'فشل حفظ معلومات الوظيفة');
            this.isSaving = false;
          },
        });
      },
      error: (e) => {
        this.handleErr(e, 'فشل حفظ المعلومات الشخصية');
        this.isSaving = false;
      },
    });
  }

  // ---------------- Preview helpers ----------------
  private canEmbed(url: string) {
    // Allow embedding from same origin, blob URLs, or any HTTPS URL (for API files)
    return url.startsWith(location.origin) || 
           url.startsWith('blob:') || 
           url.startsWith('https:') ||
           url.startsWith('http:');
  }

  private setResumePreview(url: string, name?: string) {
    this.resumeUrl = url;
    const looksPdf =
      /\.pdf($|\?)/i.test(url) || !!name?.toLowerCase().endsWith('.pdf');
    // For PDF files, try to embed them regardless of origin (browser will handle CORS)
    this.isPdf = looksPdf;
    
    // Check if URL is from API (external domain)
    this.isResumeFromApi = url.startsWith('https://') && 
                           !url.startsWith(location.origin) && 
                           !url.startsWith('blob:');
    
    this.resumeSafeUrl = this.isPdf
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : null;
  }

  private clearResumePreview() {
    this.resumeUrl = null;
    this.resumeSafeUrl = null;
    this.isPdf = false;
    this.isResumeFromApi = false;
  }

  // Open PDF in new window if from API (to avoid CORS/iframe issues)
  openResumeInNewWindow(): void {
    if (this.resumeUrl) {
      window.open(this.resumeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Toggle preview
  togglePreview(): void {
      this.showPreview = !this.showPreview;
  }

  // ================== Change Password Dialog ==================
  changePasswordDialogVisible = false;
  changingPassword = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  changePasswordForm = {
    old_password: '',
    new_password: '',
    new_password_confirm: ''
  };

  openChangePasswordDialog(): void {
    this.changePasswordDialogVisible = true;
  }

  closeChangePasswordDialog(): void {
    if (this.changingPassword) return; // Prevent closing while changing password
    this.changePasswordDialogVisible = false;
    // Reset form
    this.changePasswordForm = {
      old_password: '',
      new_password: '',
      new_password_confirm: ''
    };
    // Reset password visibility
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword(): void {
    if (this.changingPassword) return; // Prevent multiple submissions
    
    if (this.changePasswordForm.new_password !== this.changePasswordForm.new_password_confirm) {
      this.toastr.error('تأكيد كلمة المرور غير مطابق');
      return;
    }

    this.changingPassword = true;

    this.http.post(environment.getUrl('change-password', 'accounts'), this.changePasswordForm)
      .subscribe({
        next: (res: any) => {
          // per your docs: "new token returned"
          if (res?.access) {
            localStorage.setItem('access', res.access);
          }
          if (res?.refresh) localStorage.setItem('refresh', res.refresh);

          this.toastr.success('تم تغيير كلمة المرور بنجاح');
          this.changingPassword = false;
          this.closeChangePasswordDialog();
        },
        error: (err) => {
          this.errors.error(err);
          console.error(err);
          this.changingPassword = false;
        }
      });
  }

  private toAbsolute(path?: string | null): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    return `${base}/${String(path).replace(/^\/+/, '')}`;
  }

  // ---------------- Date helpers ----------------
  private normalizeDateForInput(value: any): string {
    if (!value) return '';
    const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const dmy = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmy) {
      const [, dd, mm, yyyy] = dmy;
      return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private normalizeDateForApi(value: any): string {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
      return value;
    if (value instanceof Date) {
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const dd = String(value.getDate()).padStart(2, '0');
      return `${value.getFullYear()}-${mm}-${dd}`;
    }
    return this.normalizeDateForInput(value);
  }

  private handleErr(err: any, fallback: string) {
    const msg = err?.error
      ? Object.values(err.error).flat().join(' | ')
      : fallback;
    this.toastr.error(msg);
    console.error(err);
  }

  // Handle date selection from PrimeNG Calendar
  onDateOfBirthSelect(event: any): void {
    if (event) {
      const dateStr = this.normalizeDateForApi(event);
      this.basicForm.patchValue({ date_of_birth: dateStr }, { emitEvent: false });
    } else {
      this.basicForm.patchValue({ date_of_birth: '' }, { emitEvent: false });
    }
  }
}
