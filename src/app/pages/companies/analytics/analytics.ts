import { Component, OnInit, inject } from '@angular/core';
import { CompanyService, EmployerDashboardStats } from '../core/services/company.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class Analytics implements OnInit {
  private companyService = inject(CompanyService);
  private toastr = inject(ToastrService);

  dashboardData: EmployerDashboardStats | null = null;
  loading = true;

  // Chart data
  appsOverTimeData: any;
  appsOverTimeOptions: any;

  jobsByCityData: any;
  jobsByCityOptions: any;

  jobsByCategoryData: any;
  jobsByCategoryOptions: any;

  jobsByTypeData: any;
  jobsByTypeOptions: any;

  applicationsByStatusData: any;
  applicationsByStatusOptions: any;

  applicantsByCityData: any;
  applicantsByCityOptions: any;

  applicantsByCategoryData: any;
  applicantsByCategoryOptions: any;

  applicantsByJobTitleData: any;
  applicantsByJobTitleOptions: any;

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.companyService.getEmployerDashboardStats().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.initializeCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.toastr.error('فشل تحميل بيانات لوحة التحكم', 'خطأ');
        this.loading = false;
      }
    });
  }

  initializeCharts(): void {
    if (!this.dashboardData) return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#dee2e6';

    // Applications over time (Line Chart)
    this.appsOverTimeData = {
      labels: this.dashboardData.charts.apps_over_time.labels,
      datasets: [
        {
          label: 'الطلبات',
          data: this.dashboardData.charts.apps_over_time.series,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--primary-color') || '#256EEB',
          tension: 0.4
        }
      ]
    };
    this.appsOverTimeOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    // Jobs by City (Pie Chart)
    this.jobsByCityData = {
      labels: this.dashboardData.charts.jobs_by_city.labels,
      datasets: [
        {
          data: this.dashboardData.charts.jobs_by_city.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.jobs_by_city.labels.length)
        }
      ]
    };
    this.jobsByCityOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Jobs by Category (Pie Chart)
    this.jobsByCategoryData = {
      labels: this.dashboardData.charts.jobs_by_category.labels,
      datasets: [
        {
          data: this.dashboardData.charts.jobs_by_category.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.jobs_by_category.labels.length)
        }
      ]
    };
    this.jobsByCategoryOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Jobs by Type (Pie Chart)
    this.jobsByTypeData = {
      labels: this.dashboardData.charts.jobs_by_type.labels,
      datasets: [
        {
          data: this.dashboardData.charts.jobs_by_type.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.jobs_by_type.labels.length)
        }
      ]
    };
    this.jobsByTypeOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Applications by Status (Pie Chart)
    this.applicationsByStatusData = {
      labels: this.dashboardData.charts.applications_by_status.labels,
      datasets: [
        {
          data: this.dashboardData.charts.applications_by_status.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.applications_by_status.labels.length)
        }
      ]
    };
    this.applicationsByStatusOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Applicants by City (Pie Chart)
    this.applicantsByCityData = {
      labels: this.dashboardData.charts.applicants_by_city.labels,
      datasets: [
        {
          data: this.dashboardData.charts.applicants_by_city.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.applicants_by_city.labels.length)
        }
      ]
    };
    this.applicantsByCityOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Applicants by Category (Pie Chart)
    this.applicantsByCategoryData = {
      labels: this.dashboardData.charts.applicants_by_category.labels,
      datasets: [
        {
          data: this.dashboardData.charts.applicants_by_category.series,
          backgroundColor: this.getChartColors(this.dashboardData.charts.applicants_by_category.labels.length)
        }
      ]
    };
    this.applicantsByCategoryOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor
          }
        }
      }
    };

    // Applicants by Job Title (Bar Chart)
    this.applicantsByJobTitleData = {
      labels: this.dashboardData.charts.applicants_by_job_title.labels,
      datasets: [
        {
          label: 'المتقدمون',
          data: this.dashboardData.charts.applicants_by_job_title.series,
          backgroundColor: documentStyle.getPropertyValue('--primary-color') || '#256EEB'
        }
      ]
    };
    this.applicantsByJobTitleOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };
  }

  getChartColors(count: number): string[] {
    const colors = [
      '#256EEB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'
    ];
    return colors.slice(0, count);
  }
}
