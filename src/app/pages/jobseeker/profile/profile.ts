// profile.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from './profile.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit, OnDestroy {
  basicForm!: FormGroup;
  jobForm!: FormGroup;

  selectedFile: File | null = null;      // avatar
  selectedResume: File | null = null;    // resume

  resumeUrl: string | null = null;
  resumeSafeUrl: SafeResourceUrl | null = null;
  isPdf = false;
  private toRevoke: string | null = null;
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
      // ✅ no PrimeUI date import, and empty default
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

  // 🔹 Clean display name for resume
  get resumeDisplayName(): string {
    if (this.selectedResume?.name) return this.selectedResume.name;
    if (this.resumeUrl) {
      try { return decodeURIComponent(this.resumeUrl.split('/').pop() || 'السيرة الذاتية'); }
      catch { return 'السيرة الذاتية'; }
    }
    return 'السيرة الذاتية';
  }

  // 🔹 Avatar file select
  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  // 🔹 Resume file select + preview
  onResumeChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedResume = file;
    if (this.toRevoke) { URL.revokeObjectURL(this.toRevoke); this.toRevoke = null; }

    if (file) {
      const url = URL.createObjectURL(file);
      this.setResumePreview(url, file.name);
      this.toRevoke = url;
    } else {
      this.clearResumePreview();
    }
  }

  // 🔹 Load profile and normalize date for <input type="date">
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
          date_of_birth: this.normalizeDateForInput(user.date_of_birth),
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
          availability: typeof js.availability === 'boolean' ? js.availability : true,
          preferred_job_type: js.preferred_job_type || 'full_time',
          languages: js.languages || '',
        });
        debugger;
        const resumePath = js?.resume;
        const abs = this.toAbsolute(resumePath);
        if (abs) this.setResumePreview(abs);
      },
      error: () => this.toastr.error('تعذر تحميل البيانات'),
    });
  }

  private canEmbed(url: string) {
  return url.startsWith(location.origin) || url.startsWith('blob:');
}

private setResumePreview(url: string, name?: string) {
  this.resumeUrl = url;
  const looksPdf = /\.pdf($|\?)/i.test(url) || !!name?.toLowerCase().endsWith('.pdf');
  this.isPdf = looksPdf && this.canEmbed(url);
  this.resumeSafeUrl = this.isPdf
    ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
    : null;
}

  private clearResumePreview() {
    this.resumeUrl = null;
    this.resumeSafeUrl = null;
    this.isPdf = false;
  }
  private toAbsolute(path?: string | null): string | null {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  return `${base}/${String(path).replace(/^\/+/, '')}`;
}
  // ✅ Normalize any backend date -> "YYYY-MM-DD" for the date input
  private normalizeDateForInput(value: any): string {
    if (!value) return '';
    // ISO with time -> take first 10 chars
    const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];

    // DD/MM/YYYY -> YYYY-MM-DD
    const dmy = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmy) {
      const [, dd, mm, yyyy] = dmy;
      return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
    }

    // Fallback parse
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  // ✅ What we send to API: always "YYYY-MM-DD" or empty ""
  private normalizeDateForApi(value: any): string {
    if (!value) return '';
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    if (value instanceof Date) {
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const dd = String(value.getDate()).padStart(2, '0');
      return `${value.getFullYear()}-${mm}-${dd}`;
    }
    // try parsing any other string
    return this.normalizeDateForInput(value);
  }

  saveChanges(): void {
    if (this.basicForm.invalid || this.jobForm.invalid) {
      this.toastr.error('تحقق من الحقول المطلوبة');
      return;
    }

    // ---------- BASIC PROFILE ----------
    const b = this.basicForm.value;
    const dob = this.normalizeDateForApi(b.date_of_birth);
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
    // Build payload without empty props (so backend won't get empty string)
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
        Object.entries(basicPayload).forEach(([k, v]) => fd.append(k, String(v)));
        fd.append('profile_picture', this.selectedFile);
        return this.profile.updateBasicFormData(fd);
      } else {
        return this.profile.updateBasic(basicPayload);
      }
    })();

    saveBasic$.subscribe({
      next: () => {
        // ---------- JOB SEEKER ----------
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
          jobFd.append(k, typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v));
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
    const msg = err?.error ? Object.values(err.error).flat().join(' | ') : fallback;
    this.toastr.error(msg);
    console.error(err);
  }
}
