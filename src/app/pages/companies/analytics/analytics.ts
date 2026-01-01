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
  isExporting = false;

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

  async exportToPDF(): Promise<void> {
    if (this.isExporting) return;
    
    this.isExporting = true;
    
    try {
      // Dynamic import for html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      const container = document.querySelector('.analytics-container') as HTMLElement;
      if (!container) {
        this.toastr.error('لم يتم العثور على المحتوى للتصدير');
        this.isExporting = false;
        return;
      }

      // Hide the export button before exporting
      const exportButton = container.querySelector('.btn-export-pdf') as HTMLElement;
      const originalButtonDisplay = exportButton?.style.display || '';
      const originalButtonVisibility = exportButton?.style.visibility || '';
      if (exportButton) {
        exportButton.style.display = 'none';
        exportButton.style.visibility = 'hidden';
      }

      // Wait for charts to render properly
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create header element to prepend
      const headerHTML = `
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; page-break-inside: avoid;">
          <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 6px 0; text-align: right; line-height: 1.2;">
            التحليلات والإحصائيات
          </h1>
          <p style="font-size: 12px; color: #6b7280; margin: 0 0 5px 0; text-align: right; line-height: 1.4;">
            تقرير شامل عن إحصائيات الوظائف والطلبات والشركات. يحتوي هذا التقرير على نظرة عامة على الأداء والأنشطة في النظام.
          </p>
          <p style="font-size: 10px; color: #9ca3af; margin: 0; text-align: right;">
            تاريخ التقرير: ${new Date().toLocaleDateString('ar-YE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      `;

      // Create a temporary div to hold the header
      const tempHeader = document.createElement('div');
      tempHeader.innerHTML = headerHTML;
      const headerElement = tempHeader.firstElementChild as HTMLElement;

      // Insert header at the beginning of container
      container.insertBefore(headerElement, container.firstChild);

      // Wait a bit for the header to render
      await new Promise(resolve => setTimeout(resolve, 200));

      // Hide the original header
      const originalHeader = container.querySelector('.employer-header') as HTMLElement;
      const originalHeaderDisplay = originalHeader?.style.display || '';
      if (originalHeader) {
        originalHeader.style.display = 'none';
      }
      
      // Temporarily reduce padding and spacing for PDF
      const originalPadding = container.style.padding;
      container.style.padding = '8px';
      
      // Reduce spacing in stats grid
      const statsGrid = container.querySelector('.stats-grid') as HTMLElement;
      const originalStatsGap = statsGrid?.style.gap;
      const originalStatsMarginBottom = statsGrid?.style.marginBottom;
      if (statsGrid) {
        statsGrid.style.gap = '10px';
        statsGrid.style.marginBottom = '12px';
      }
      
      // Reduce spacing in charts grid
      const chartsGrid = container.querySelector('.charts-grid') as HTMLElement;
      const originalChartsGap = chartsGrid?.style.gap;
      const originalChartsMarginBottom = chartsGrid?.style.marginBottom;
      if (chartsGrid) {
        chartsGrid.style.gap = '12px';
        chartsGrid.style.marginBottom = '12px';
      }

      const opt = {
        margin: [5, 5, 5, 5] as [number, number, number, number],
        filename: `تحليلات_وإحصائيات_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          allowTaint: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.stat-card', '.chart-card']
        }
      };

      await html2pdf().set(opt).from(container).save();
      
      // Remove the header we added
      if (headerElement && headerElement.parentNode) {
        headerElement.parentNode.removeChild(headerElement);
      }
      
      // Restore original styles
      container.style.padding = originalPadding;
      if (statsGrid) {
        statsGrid.style.gap = originalStatsGap || '';
        statsGrid.style.marginBottom = originalStatsMarginBottom || '';
      }
      if (chartsGrid) {
        chartsGrid.style.gap = originalChartsGap || '';
        chartsGrid.style.marginBottom = originalChartsMarginBottom || '';
      }
      if (originalHeader) {
        originalHeader.style.display = originalHeaderDisplay;
      }
      
      // Restore button visibility
      if (exportButton) {
        exportButton.style.display = originalButtonDisplay;
        exportButton.style.visibility = originalButtonVisibility;
      }
      
      this.toastr.success('تم تصدير التقرير بنجاح');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      this.toastr.error('فشل تصدير التقرير. حاول مرة أخرى.');
    } finally {
      this.isExporting = false;
    }
  }
}
