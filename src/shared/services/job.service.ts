import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { CreateJobDto } from '@app/companies/models';



@Injectable({ providedIn: 'root' })
export class JobService {


  constructor(private http: HttpClient) {}

  createJob(body: CreateJobDto): Observable<any> {
    const url = environment.getUrl('create', 'jobs');
    return this.http.post(url, body);
  }
}
