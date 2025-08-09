// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from './profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  basicForm!: FormGroup;
  jobForm!: FormGroup;
  selectedResume: File | null = null;

  constructor(
    private fb: FormBuilder,
    private profile: ProfileService,
    private toastr: ToastrService
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

    this.loadProfile(); // 👈 fill inputs
  }

  onResumeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedResume =
      input.files && input.files.length ? input.files[0] : null;
  }
  private loadProfile() {
    this.profile.getProfile().subscribe({
      next: (res: any) => {
        // Swagger sometimes returns { data: {...} } — handle both
        const root = res?.data ?? res;

        // Basic info
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

        // Job-seeker info (may live at root or under `profile`)
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
      },
      error: (e) => {
        console.error(e);
        this.toastr.error('تعذر تحميل البيانات');
      },
    });
  }

  private toDateOnly(value: string | null): string {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // already OK
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  onAvatarSelected(fileString: string) {
    // Call this after converting the selected file to URL/base64 (if needed)
    this.basicForm.patchValue({ profile_picture: fileString });
  }

  saveChanges(): void {
    if (this.basicForm.invalid || this.jobForm.invalid) {
      this.toastr.error('تحقق من الحقول المطلوبة');
      return;
    }

    // ----- BASIC PROFILE (multipart, because of profile_picture) -----
    const b = this.basicForm.value;
    const dob = this.formatDateForApi(b.date_of_birth);
    if (b.date_of_birth && !dob) {
      this.toastr.error('صيغة التاريخ يجب أن تكون YYYY-MM-DD');
      return;
    }

    const basicFd = new FormData();
    const basicEntries: Record<string, any> = {
      first_name: b.first_name,
      last_name: b.last_name,
      email: b.email,
      phone: b.phone,
      date_of_birth: dob,
      bio: b.bio,
      location: b.location,
    };
    Object.entries(basicEntries).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '')
        basicFd.append(k, String(v));
    });
    if (this.selectedFile) basicFd.append('profile_picture', this.selectedFile);

    this.profile.updateJobSeekerFormData(basicFd).subscribe({
      next: () => {
        // ----- JOB SEEKER (multipart, because of resume) -----
        const j = this.jobForm.value;
        const jobFd = new FormData();

        // append non-empty simple fields
        const jobEntries: Record<string, any> = {
          experience_level: j.experience_level,
          education_level: j.education_level,
          skills: j.skills,
          expected_salary_min: j.expected_salary_min,
          expected_salary_max: j.expected_salary_max,
          availability: j.availability, // boolean -> string
          preferred_job_type: j.preferred_job_type,
          languages: j.languages,
        };

        Object.entries(jobEntries).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '') return;
          // Ensure booleans/numbers go as strings so the backend parser is happy
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
  selectedFile: File | null = null;

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.selectedFile =
      input.files && input.files.length ? input.files[0] : null;
  }
  private formatDateForApi(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') {
      // already correct: 2025-08-09
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      // try MM/DD/YYYY -> YYYY-MM-DD
      const m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m) {
        const [, mm, dd, yyyy] = m;
        return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
      }
      // last resort: Date parse
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${mm}-${dd}`;
      }
      return ''; // invalid
    }
    if (value instanceof Date) {
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const dd = String(value.getDate()).padStart(2, '0');
      return `${value.getFullYear()}-${mm}-${dd}`;
    }
    return '';
  }
}
