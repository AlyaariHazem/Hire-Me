import { Component, OnInit } from '@angular/core';
import { User } from '../services/user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../profile/profile.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar implements OnInit {
  basicForm!: FormGroup;
  userData: any;
  userPicture: string | null = null;

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  saving = false;

  constructor(
    private userService: User,
    private fb: FormBuilder,
    private toast: ToastrService,
    private profile: ProfileService
  ) {
    this.userService.user$.subscribe((data:any) => {
      this.userData = data;
      this.userPicture = this.toAbsolute(this.userData?.data?.user?.profile_picture);
    });
  }

  ngOnInit(): void {
    this.basicForm = this.fb.group({ profile_picture: [''] });
  }

  onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] || null;
    this.selectedFile = file;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  cancelAvatar() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.selectedFile = null;
  }

  saveAvatar() {
    if (!this.selectedFile) return;
    const fd = new FormData();
    fd.append('profile_picture', this.selectedFile);

    this.saving = true;
    this.profile.updateBasicFormData(fd).subscribe({
      next: () => {
        this.saving = false;
        this.userPicture = this.previewUrl; // instant UI update
        this.selectedFile = null;
        this.previewUrl = null;
        this.toast.success('تم تحديث الصورة');
      },
      error: () => {
        this.saving = false;
        this.toast.error('فشل تحديث الصورة');
      }
    });
  }
  toAbsolute(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;   // already absolute
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  const p = String(path).replace(/^\/+/, '');
  return `${base}/${p}`;
}
}
