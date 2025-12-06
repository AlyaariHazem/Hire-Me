import { Component, OnInit, inject } from '@angular/core';
import { ApplicationService, Application } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'shared/base/base';
import { environment } from 'environments/environment';

type ApplicationStatus = 'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.html',
  styleUrls: ['./applications.scss', 
    '../../../../shared/scss/button.scss']
})
export class Applications extends Base implements OnInit {
  private applicationService = inject(ApplicationService);

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
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (response) => {
        this.applications = response.results || [];
        this.updateStatusCounts();
        this.filterApplications();
        this.isLoading = false;
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.isLoading = false;
      },
    });
  }

  updateStatusCounts(): void {
    this.statusCounts.all = this.applications.length;
    this.statusCounts.pending = this.applications.filter((app) => app.status === 'pending').length;
    this.statusCounts.reviewed = this.applications.filter((app) => app.status === 'reviewed').length;
    this.statusCounts.accepted = this.applications.filter((app) => app.status === 'accepted').length;
    this.statusCounts.rejected = this.applications.filter((app) => app.status === 'rejected').length;
  }

  setActiveTab(tab: ApplicationStatus): void {
    this.activeTab = tab;
    this.filterApplications();
  }

  filterApplications(): void {
    if (this.activeTab === 'all') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(
        (app) => app.status === this.activeTab
      );
    }
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
