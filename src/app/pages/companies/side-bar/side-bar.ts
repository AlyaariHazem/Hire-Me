import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar implements OnInit {
  logo:string = '';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    const url = environment.getUrl('profile', 'accounts');
    this.http.get(url).subscribe({
      next: (data:any) => {
        debugger;
        const Logo = data.data.profile.company_logo;
        this.logo = environment.apiBaseUrl + Logo;
      },
      error: (err) => {
        this.toastr.error('فشل في تحميل بيانات الشركة');
        console.error(err);
      }
    });
  }
}
