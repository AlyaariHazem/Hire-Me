import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Errors } from 'shared/services/errors';

import { SharedModule } from 'shared/shared-module';

@Component({
  selector: 'app-base',
  imports: [SharedModule],
  templateUrl: './base.html',
  styleUrl: './base.scss'
})
export class Base {
  toastr = inject(ToastrService);
  errors = inject(Errors);

}
