import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { environment } from 'environments/environment';
import { ProfileStoreService, Profile } from 'shared/services/profile.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar implements OnInit {
  // English: reactive logo preview (absolute URL)
  logo = signal<string>('');
  // English: default company name until profile loads
  companyName = 'شركة التقنيات المتقدمة';

  private profileStore = inject(ProfileStoreService);

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // English: trigger initial load once (safe to call many times)
    this.profileStore.ensureLoaded();

    // English: subscribe to the shared profile stream, typed via guard
    this.profileStore.profile$
      .pipe(filter((p): p is Profile => !!p))
      .subscribe(p => {
        this.companyName = p.company_name ?? this.companyName;
        this.logo.set(this.toAbsolute(p.company_logo));
      });
  }

  // English: normalize relative path to absolute API URL
  private toAbsolute(path?: string | null): string {
    if (!path) return '';
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }
}
