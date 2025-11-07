import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

import { environment } from 'environments/environment';
import { ProfileService } from '../core/services/profile.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar {
  logo$: any;
  companyName: string = 'شركة التقنيات المتقدمة';
  constructor(private http: HttpClient, private toastr: ToastrService, private profileService: ProfileService) {
    this.logo$ = this.profileService.getProfile$().pipe(
      map(p => environment.apiBaseUrl + p.company_logo)
    );
  }
  profile:any;
  profileDataService = inject(ProfileService);

  ngOnInit(): void {
     this.profileDataService.getProfile().subscribe({
          next: (data:any) => {
            this.profile = data.data.profile;
            this.companyName = this.profile.company_name;
            debugger;
            console.log('Profile data:', this.profile);
          }
       });
  }

}
