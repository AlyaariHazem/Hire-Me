import { Component } from '@angular/core';
import { CompaniesModule } from "../companies-module";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-jobs',
  imports: [CompaniesModule],
  templateUrl: './manage-jobs.html',
  styleUrl: './manage-jobs.scss'
})
export class ManageJobs {

}
