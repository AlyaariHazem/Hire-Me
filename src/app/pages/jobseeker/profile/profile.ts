// profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from './profile.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit, OnDestroy {
  basicForm!: FormGroup;
  jobForm!: FormGroup;

  selectedFile: File | null = null; // avatar
  selectedResume: File | null = null; // resume

  // resume preview state
  resumeUrl: string | null = null; // object/remote URL
  resumeSafeUrl: SafeResourceUrl | null = null;
  isPdf = false;
  private toRevoke: string | null = null; // for object URLs
  showPreview = false;

  constructor(
    private fb: FormBuilder,
    private profile: ProfileService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

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

    this.loadProfile();
  }

  ngOnDestroy(): void {
    if (this.toRevoke) URL.revokeObjectURL(this.toRevoke);
  }
  get resumeDisplayName(): string {
    // اسم من الملف المختار أو من رابط السيرفر
    if (this.selectedResume?.name) return this.selectedResume.name;
    if (this.resumeUrl) {
      try {
        return decodeURIComponent(
          this.resumeUrl.split('/').pop() || 'السيرة الذاتية'
        );
      } catch {
        return 'السيرة الذاتية';
      }
    }
    return 'السيرة الذاتية';
  }
  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile =
      input.files && input.files.length ? input.files[0] : null;
  }

  onResumeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    this.selectedResume = file;

    // clear previous object URL
    if (this.toRevoke) {
      URL.revokeObjectURL(this.toRevoke);
      this.toRevoke = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      this.setResumePreview(url, file.name);
      this.toRevoke = url; // revoke on destroy/change
    } else {
      this.clearResumePreview();
    }
  }

  private loadProfile() {
    this.profile.getProfile().subscribe({
      next: (res: any) => {
        const root = res?.data ?? res;

        const user = root.user ?? root.profile?.user ?? {};
        this.basicForm.patchValue({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          date_of_birth: this.toDateOnly(user.date_of_birth),
          profile_picture: user.profile_picture || '',
          bio: user.bio || '',
          location: user.location || '',
        });

        const js = root.profile ?? root;
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

        // existing resume from API (absolute or relative URL)
        if (js?.resume) this.setResumePreview(js.resume);
      },
      error: () => this.toastr.error('تعذر تحميل البيانات'),
    });
  }

  private setResumePreview(url: string, name?: string) {
    this.resumeUrl = url;
    const looksPdf =
      /\.pdf($|\?)/i.test(url) ||
      (!!name && name.toLowerCase().endsWith('.pdf'));
    this.isPdf = looksPdf;
    this.resumeSafeUrl = looksPdf
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : null;
  }

  private clearResumePreview() {
    this.resumeUrl = null;
    this.resumeSafeUrl = null;
    this.isPdf = false;
  }

  private toDateOnly(value: string | null): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  onAvatarSelected(fileString: string) {
    this.basicForm.patchValue({ profile_picture: fileString });
  }

  saveChanges(): void {
    if (this.basicForm.invalid || this.jobForm.invalid) {
      this.toastr.error('تحقق من الحقول المطلوبة');
      return;
    }

    // ---------- BASIC PROFILE -> /api/accounts/profile/update/ ----------
    const b = this.basicForm.value;
    const dob = this.formatDateForApi(b.date_of_birth);
    if (b.date_of_birth && !dob) {
      this.toastr.error('صيغة التاريخ يجب أن تكون YYYY-MM-DD');
      return;
    }

    const basicPayload: {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      date_of_birth?: string;
      bio?: string;
      location?: string;
      profile_picture?: string;
    } = {
      first_name: b.first_name,
      last_name: b.last_name,
      email: b.email,
      phone: b.phone,
      date_of_birth: dob,
      bio: b.bio,
      location: b.location,
    };

    const saveBasic$ = (() => {
      if (this.selectedFile) {
        const fd = new FormData();
        Object.entries(basicPayload).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '')
            fd.append(k, String(v));
        });
        fd.append('profile_picture', this.selectedFile);
        return this.profile.updateBasicFormData(fd);
      } else {
        return this.profile.updateBasic(basicPayload);
      }
    })();

    saveBasic$.subscribe({
      next: () => {
        // ---------- JOB SEEKER -> /api/accounts/profile/job-seeker/ ----------
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

        this.profile.updateJobSeekerFormData(jobFd).subscribe({
          next: () => this.toastr.success('تم حفظ التغييرات بنجاح'),
          error: (e) => this.handleErr(e, 'فشل حفظ معلومات الوظيفة'),
        });
      },
      error: (e) => this.handleErr(e, 'فشل حفظ المعلومات الشخصية'),
    });
  }

  private handleErr(err: any, fallback: string) {
    const msg = err?.error
      ? Object.values(err.error).flat().join(' | ')
      : fallback;
    this.toastr.error(msg);
    console.error(err);
  }

  private formatDateForApi(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
      }
      return '';
    }
    if (value instanceof Date) {
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const dd = String(value.getDate()).padStart(2, '0');
      return `${value.getFullYear()}-${mm}-${dd}`;
    }
    return '';
  }
}
