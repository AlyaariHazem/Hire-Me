import { Component, OnInit, inject } from '@angular/core';
import { Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'shared/base/base';
import { environment } from 'environments/environment';
import { ApplicationsStoreService, ApplicationStatus } from '../services/applications.service';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.html',
  styleUrls: ['./applications.scss', 
    '../../../../shared/scss/button.scss']
})
export class Applications extends Base implements OnInit {
  private applicationsStore = inject(ApplicationsStoreService);

  applications: Application[] = [];
  filteredApplications: Application[] = [];
  activeTab: ApplicationStatus = 'all';
  isLoading = false;

  // Status counts
  statusCounts = {
    all: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  ngOnInit(): void {
    // Subscribe to loading state
    this.applicationsStore.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    // Load applications from store
    this.applicationsStore.ensureLoaded();

    // Subscribe to applications data
    this.applicationsStore.applications$.subscribe({
      next: (data) => {
        this.applications = data.applications;
        this.statusCounts = data.statusCounts;
        this.filterApplications();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        // Set empty data on error
        this.applications = [];
        this.filteredApplications = [];
        this.statusCounts = { all: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
      },
    });
  }

  setActiveTab(tab: ApplicationStatus): void {
    this.activeTab = tab;
    this.filterApplications();
  }

  filterApplications(): void {
    this.filteredApplications = this.applicationsStore.getFilteredApplications(this.activeTab);
  }

  /**
   * Refresh applications data (useful after actions like withdrawing an application)
   */
  refreshApplications(): void {
    this.applicationsStore.refresh();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  formatSalary(min: number | null | undefined, max: number | null | undefined): string {
    if (!min && !max) return 'غير محدد';
    if (min && max) return `${min.toLocaleString()}-${max.toLocaleString()} ريال`;
    if (min) return `${min.toLocaleString()}+ ريال`;
    if (max) return `حتى ${max.toLocaleString()} ريال`;
    return 'غير محدد';
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      reviewed: 'status-reviewed',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'قيد المراجعة',
      reviewed: 'تمت المراجعة',
      accepted: 'مقبولة',
      rejected: 'مرفوضة',
    };
    return statusMap[status] || status;
  }

  getCompanyLogo(logo: string | null): string {
    if (!logo) return 'assets/images/company-placeholder.png';
    if (logo.startsWith('http')) return logo;
    return `${environment.apiBaseUrl.replace(/\/+$/, '')}/${logo.replace(/^\/+/, '')}`;
  }

  cityLabel(city: string | null | undefined): string {
    if (!city) return 'غير محدد';
    const cityMap: Record<string, string> = {
      sanaa: 'صنعاء',
      aden: 'عدن',
      taiz: 'تعز',
      hodeidah: 'الحديدة',
      ibb: 'إب',
      mukalla: 'المكلا',
      remote: 'عمل عن بُعد',
    };
    return cityMap[city.toLowerCase()] || city;
  }
}
