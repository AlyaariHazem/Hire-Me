import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header-public',
  standalone: false,
  templateUrl: './header-public.html',
  styleUrl: './header-public.scss'
})
export class HeaderPublic {
toastr = inject(ToastrService);

notImplemented(){
  this.toastr.info('هذه الميزة غير متوفرة حالياً', 'لم يتم التنفيذ');
}
}
