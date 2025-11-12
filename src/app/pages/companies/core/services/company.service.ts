import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'environments/environment.development';
import { ICompanyData } from '../models';

interface CompaniesListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: ICompanyData[];
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  createCompany(payload: Partial<ICompanyData>) {
    return this.http.post<ICompanyData>(
      environment.getUrl('create', 'companies'),
      payload
    );
  }

  // ✅ FIXED: extract results[]
  getMyCompanies() {
    return this.http
      .get<CompaniesListResponse>(
        environment.getUrl('my-companies', 'companies')
      )
      .pipe(map(res => res?.results ?? []));
  }

  getBySlug(slug: string) {
    return this.http.get<ICompanyData>(
      environment.getUrl(slug, 'companies')
    );
  }

  updateCompany(slug: string, payload: Partial<ICompanyData>) {
    return this.http.put<ICompanyData>(
      environment.getUrl(`${slug}/update`, 'companies'),
      payload
    );
  }

  patchCompany(slug: string, payload: Partial<ICompanyData>) {
    return this.http.patch<ICompanyData>(
      environment.getUrl(`${slug}/update`, 'companies'),
      payload
    );
  }

  deleteCompany(slug: string) {
    return this.http.delete<void>(
      environment.getUrl(`${slug}/delete`, 'companies')
    );
  }
}
