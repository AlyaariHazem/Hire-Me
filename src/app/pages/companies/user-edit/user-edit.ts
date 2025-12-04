import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil, filter } from 'rxjs';

import { environment } from 'environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';
import { ProfileService } from '../core/services/profile.service';
import { Base } from 'shared/base/base';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.scss'],
})
export class UserEditComponent extends Base implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  saving = false;

  // English: selected profile picture file and preview URL
  profilePictureFile?: File;
  profilePicture$?: string | null;

  profileStore = inject(ProfileStoreService);

  // English: keep a typed, minimal form model
  form: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    bio: string;
    location: string;
  } = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    bio: '',
    location: '',
  };

  constructor(
    private http: HttpClient,
    private profileService: ProfileService
  ) {
    super();
  }

  ngOnInit(): void {
    // English: bind to shared profile stream (typed via type guard)
    this.profileStore.profile$
      .pipe(
        takeUntil(this.destroy$),
        filter((p): p is Profile => !!p)
      )
      .subscribe((p) => {
        // English: handle both direct user property and nested profile.user structure
        const user = (p as any).user || (p as any).profile?.user || {};
        
        // English: build absolute profile picture preview
        this.profilePicture$ = user.profile_picture 
          ? this.toAbsolute(user.profile_picture) 
          : null;
        
        // English: patch values without replacing the reference
        this.form.first_name = user.first_name ?? '';
        this.form.last_name = user.last_name ?? '';
        this.form.email = user.email ?? '';
        this.form.phone = user.phone ?? '';
        this.form.date_of_birth = this.normalizeDateForInput(user.date_of_birth);
        this.form.bio = user.bio ?? '';
        this.form.location = user.location ?? '';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // English: convert relative path to absolute based on API base URL
  private toAbsolute(path: string): string {
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const p = String(path).replace(/^\/+/, '');
    return `${base}/${p}`;
  }

  // English: normalize date for input field (YYYY-MM-DD)
  private normalizeDateForInput(value: any): string {
    if (!value) return '';
    const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  // English: normalize date for API (YYYY-MM-DD)
  private normalizeDateForApi(value: any): string | null {
    if (!value) return null;
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value))
      return value;
    if (value instanceof Date) {
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const dd = String(value.getDate()).padStart(2, '0');
      return `${value.getFullYear()}-${mm}-${dd}`;
    }
    return this.normalizeDateForInput(value) || null;
  }

  onProfilePictureSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.profilePictureFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.profilePicture$ = reader.result as string);
    reader.readAsDataURL(file);
  }

  save() {
    this.saving = true;

    // English: build payload
    const dob = this.normalizeDateForApi(this.form.date_of_birth);
    
    interface UserPayload {
      first_name: string;
      last_name: string;
      email: string;
      phone?: string;
      date_of_birth?: string;
      bio?: string;
      location?: string;
    }

    const payload: UserPayload = {
      first_name: this.form.first_name,
      last_name: this.form.last_name,
      email: this.form.email,
    };

    if (this.form.phone) payload.phone = this.form.phone;
    if (dob) payload.date_of_birth = dob;
    if (this.form.bio) payload.bio = this.form.bio;
    if (this.form.location) payload.location = this.form.location;

    // English: use FormData if profile picture is selected, otherwise use JSON
    const save$ = (() => {
      if (this.profilePictureFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            fd.append(k, String(v));
          }
        });
        fd.append('profile_picture', this.profilePictureFile);
        return this.profileService.updateBasicFormData(fd);
      } else {
        return this.profileService.updateBasic(payload);
      }
    })();

    save$.subscribe({
      next: () => {
        this.toastr.success('تم حفظ بيانات المستخدم بنجاح');
        this.saving = false;
        // English: refresh the shared cache so all components see the update
        this.profileStore.refresh();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.saving = false;
      },
    });
  }
}

