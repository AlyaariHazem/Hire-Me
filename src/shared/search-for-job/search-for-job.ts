import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-for-job',
  standalone: false,
  templateUrl: './search-for-job.html',
  styleUrl: './search-for-job.scss'
})
export class SearchForJob {
  constructor(private router:Router) {}

  // Method to handle company view, can be expanded to include actual navigation or logic
viewCompany(name?:string):void{
if(name){
  this.router.navigate(['/companies/company-profile']);
console.log("Viewing company:", name);
}
}
}
