import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
constructor(private toastr: ToastrService) {}

saveChanges() {
  // Logic to save changes
  this.toastr.success('تم حفظ التغييرات بنجاح');
}
}
