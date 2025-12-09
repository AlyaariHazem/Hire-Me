import { Injectable, computed, inject, signal } from '@angular/core';
import { tap, catchError, map, Observable } from 'rxjs';
import { CompanyService } from '../core/services/company.service';
import { ICompanyData } from '@app/companies/models';

export interface CompanyDataState {
  companies: ICompanyData[];
  loading: boolean;
  filters: {
    search: string;
    industry: string | null;
    size: string | null;
  };
  loaded: boolean;
}

@Injectable({ providedIn: 'root' })
export class CompanyDataStoreService {
  private companyService = inject(CompanyService);

  // Initial state
  private initialState: CompanyDataState = {
    companies: [],
    loading: false,
    filters: {
      search: '',
      industry: null,
      size: null
    },
    loaded: false
  };

  // State signal
  private state = signal<CompanyDataState>(this.initialState);
  maxYear = signal<number>(new Date().getFullYear());
  // Selectors
  readonly companies = computed(() => this.state().companies);
  readonly loading = computed(() => this.state().loading);
  readonly filters = computed(() => this.state().filters);
  
  // Computed filtered list
  readonly filteredCompanies = computed(() => {
    const { companies, filters } = this.state();
    let result = [...companies];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(company => 
        (company.name || '').toLowerCase().includes(searchTerm) ||
        (company.slug || '').toLowerCase().includes(searchTerm) ||
        (company.email || '').toLowerCase().includes(searchTerm) ||
        (company.country || '').toLowerCase().includes(searchTerm) ||
        (company.city || '').toLowerCase().includes(searchTerm) ||
        (company.industry || '').toLowerCase().includes(searchTerm)
      );
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter(company => company.industry === filters.industry);
    }

    // Size filter
    if (filters.size) {
      result = result.filter(company => company.size === filters.size);
    }

    return result;
  });

  constructor() {}

  // Actions

  init(): void {
    if (!this.state().loaded && !this.state().loading) {
      this.loadCompanies();
    }
  }

  loadCompanies(): void {
    this.patchState({ loading: true });
    this.companyService.getMyCompanies().subscribe({
      next: (list) => {
        this.patchState({
          companies: list || [],
          loading: false,
          loaded: true
        });
      },
      error: (err) => {
        console.error('Failed to load companies', err);
        this.patchState({ loading: false });
      }
    });
  }

  refresh(): void {
    this.loadCompanies();
  }

  setSearchFilter(search: string): void {
    this.updateFilters({ search });
  }

  setIndustryFilter(industry: string | null): void {
    this.updateFilters({ industry });
  }

  setSizeFilter(size: string | null): void {
    this.updateFilters({ size });
  }

  // CRUD Operations

  createCompany(formData: FormData): Observable<ICompanyData | null> {
    this.patchState({ loading: true });
    return this.companyService.createCompany(formData).pipe(
      tap(created => {
        if (created) {
          const currentCompanies = this.state().companies;
          this.patchState({
            companies: [created, ...currentCompanies],
            loading: false
          });
        }
      }),
      catchError(err => {
         this.patchState({ loading: false });
         throw err;
      })
    );
  }

  updateCompany(slug: string, formData: FormData): Observable<ICompanyData | null> {
    this.patchState({ loading: true });
    return this.companyService.updateCompany(slug, formData).pipe(
      tap(updated => {
        if (updated) {
          const currentCompanies = this.state().companies;
          const updatedList = currentCompanies.map(c => 
            c.id === updated.id ? updated : c
          );
          this.patchState({
            companies: updatedList,
            loading: false
          });
        }
      }),
      catchError(err => {
         this.patchState({ loading: false });
         throw err;
      })
    );
  }

  deleteCompany(slug: string, id: number): Observable<boolean> {
    // We don't set loading global here to avoid freezing the whole table, 
    // usually component handles specific row loading, but we update the list on success
    return this.companyService.deleteCompany(slug).pipe(
      map(() => true),
      tap(() => {
        const currentCompanies = this.state().companies;
        const updatedList = currentCompanies.filter(c => c.id !== id);
        this.patchState({
          companies: updatedList
        });
      })
    );
  }

  private updateFilters(partialFilters: Partial<CompanyDataState['filters']>) {
    const newFilters = { ...this.state().filters, ...partialFilters };
    this.patchState({ filters: newFilters });
  }

  private patchState(partialState: Partial<CompanyDataState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
