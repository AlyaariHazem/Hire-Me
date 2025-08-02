import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss'
})
export class Jobs {
constructor(private toastr: ToastrService) {}
  activeTab: string = 'all'; // default active tab

  showTab(tab: string,x?:any): void {
    this.activeTab = tab;
    this.toastr.info('سوف يتم تطويرها قريباً', 'تنبيه');
  }
  applyForJob(jobId: any): void {
    // Logic to apply for a job
    this.toastr.success(`تم التقديم على الوظيفة ${jobId} بنجاح`);
  }
  saveJob(jobId: any,x?:any): void {
    // Logic to save a job
    this.toastr.success(`تم حفظ الوظيفة ${jobId} بنجاح`);
  }
  shareJob(jobId: any,x?:any): void {
    // Logic to share a job
    this.toastr.success(`تم مشاركة الوظيفة ${jobId} بنجاح`);
  }
 applyToJob(jobId: any): void {
    // Logic to apply to a job
    this.toastr.success(`تم التقديم على الوظيفة ${jobId} بنجاح`);
    }
    toggleFilter(filter?: any) {
      this.toastr.info(`سوف يتم تطبيق فلتر ${filter} قريباً`, 'تنبيه');
    }
    clearAllFilters(): void {
      this.toastr.info('سوف يتم مسح جميع الفلاتر قريباً', 'تنبيه');
    }
    applyFilters(): void {
      this.toastr.success('سوف يتم تطبيق الفلاتر قريباً', 'تنبيه');
    }
    goToPage(page: number): void {
      this.toastr.info(`سوف يتم الانتقال إلى الصفحة ${page} قريباً`, 'تنبيه');
    }
    loadMoreJobs(): void {
      this.toastr.info('سوف يتم تحميل المزيد من الوظائف قريباً', 'تنبيه');
    }
}
