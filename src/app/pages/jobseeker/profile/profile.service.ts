import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  updateBasic(body: {
    first_name: string; last_name: string; email: string; phone: string;
    date_of_birth: string; profile_picture?: string; bio?: string; location?: string;
  }): Observable<any> {
    return this.http.put(environment.getUrl('profile/update','accounts'), body);
  }

  updateJobSeeker(body: {
    resume?: string;
    experience_level: 'entry'|'mid'|'senior'|'lead';
    education_level: 'high_school'|'diploma'|'bachelor'|'master'|'phd';
    skills?: string; // comma-separated or backend format
    expected_salary_min?: number;
    expected_salary_max?: number;
    availability?: boolean;
    preferred_job_type?: string; // e.g. 'full_time'
    languages?: string; // comma-separated
  }): Observable<any> {
    return this.http.put(environment.getUrl('profile/job-seeker','accounts'), body);
  }
  getProfile() {
  return this.http.get(environment.getUrl('profile', 'accounts'));
}
updateJobSeekerFormData(fd: FormData) {
    // Don't set Content-Type; Angular adds boundary automatically
    return this.http.put(
      environment.getUrl('profile/job-seeker', 'accounts'),
      fd
    );
  }
}
