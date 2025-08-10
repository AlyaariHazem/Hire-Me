import { Component } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-progress-spinner',
  standalone:false,
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent {
  visible = false;
  visible$: any;

  constructor(private loaderService: LoaderService) {
    this.visible$ = this.loaderService.loading$;
    this.loaderService.loading$.subscribe(status => {
      this.visible = status;
    });
  }
}
