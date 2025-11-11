import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

import { environment } from 'environments/environment';
import { ProfileService } from '../core/services/profile.service';
import { ProfileStoreService } from 'shared/services/profile.service';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar implements OnInit {
  logo = signal<string>('');
  companyName: string = 'شركة التقنيات المتقدمة';
  constructor(private http: HttpClient, private toastr: ToastrService, private profileService: ProfileService) {
  }
  profile:any;
  profileDataService = inject(ProfileService);
  profileStore = inject(ProfileStoreService);

  ngOnInit(): void {
    //  this.profileDataService.getProfile().subscribe({
    //       next: (data:any) => {
    //         this.profile = data.data.profile;
    //         this.companyName = this.profile.company_name;
    //         debugger;
    //         console.log('Profile data:', this.profile);
    //       }
    //    });
       this.profileStore.getProfile$().subscribe(
         (p:any) => {
           debugger;
         this.logo.set(environment.apiBaseUrl + p.company_logo);
         this.profile = p;
         this.companyName = this.profile.company_name;
         
         }
       );
  }

}
