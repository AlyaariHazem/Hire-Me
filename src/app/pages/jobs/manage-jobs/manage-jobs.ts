import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';

// JobItem interface is now in store, or we can just import the specific parts we need or keep it here if it's not exported. 
// Ideally we import from store or usage.
import { ManageJobsStoreService, TabKey, JobItem } from '../services/manage-jobs.store';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-jobs.html',
  styleUrls: ['./manage-jobs.scss'],
})
export class ManageJobs implements OnInit {
  private store = inject(ManageJobsStoreService);
  private toastr = inject(ToastrService);

  // Store Signals
  activeTab = this.store.activeTab;
  visibleJobs = this.store.visibleJobs;
  loading = this.store.loading;

  // Counts
  countActive = this.store.countActive;
  countClosed = this.store.countClosed;
  countPaused = this.store.countPaused;
  countDraft = this.store.countDraft;

  updatingStatus: Record<number, boolean> = {}; // Track which job is being updated



  constructor() {}

  ngOnInit(): void {
    this.store.init();
  }

  // English: pull employer jobs
  // fetch removed - handled by store

  // English: tab click
  selectTab(key: TabKey) {
    this.store.setTab(key);
  }

  // English: minor helpers for template
  companyName(j: JobItem): string {
    return (j as any).company_name || j.company?.name || '-';
  }

  salaryText(j: JobItem): string {
    if (j.salary_min && j.salary_max) return `${j.salary_min} - ${j.salary_max}`;
    if (j.is_salary_negotiable) return 'قابل للتفاوض';
    return '—';
  }

  // Update job status
  updateJobStatus(job: JobItem, newStatus: 'active' | 'paused' | 'closed'): void {
    if (this.updatingStatus[job.id]) return;

    this.updatingStatus[job.id] = true;
    
    // Determine is_active value based on status
    // Note: API currently only supports is_active boolean
    // For paused/closed, both will set is_active to false
    // If API later adds separate fields, we can update this logic
    const isActive = newStatus === 'active';
    
    // Update using store
    this.store.updateJobStatus(job.slug, job.id, newStatus).subscribe({
      next: (updatedJob) => {
        const statusMessages: Record<string, string> = {
          active: 'تم تفعيل الوظيفة بنجاح',
          paused: 'تم إيقاف الوظيفة مؤقتاً',
          closed: 'تم إغلاق الوظيفة'
        };
        this.toastr.success(statusMessages[newStatus] || 'تم تحديث حالة الوظيفة');
        this.updatingStatus[job.id] = false;
      },
      error: (err) => {
        console.error('Failed to update job status', err);
        this.toastr.error('فشل في تحديث حالة الوظيفة');
        this.updatingStatus[job.id] = false;
      }
    });
  }

  getJobStatus(job: JobItem): 'active' | 'paused' | 'closed' {
    // Since API only has is_active boolean, we map:
    // - true = active
    // - false = closed (we can't distinguish paused without additional API field)
    // TODO: Update when API adds separate paused/draft fields
    if (job.is_active === true) return 'active';
    return 'closed'; // Default to closed for false/undefined
  }

  isUpdating(jobId: number): boolean {
    return this.updatingStatus[jobId] || false;
  }
}
