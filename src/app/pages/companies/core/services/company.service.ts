import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient){}

  createCompany(){
    return this.http.post(environment.getUrl('create','companies'),{});
  }
  
}
