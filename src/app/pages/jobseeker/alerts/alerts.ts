import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobAlert } from 'shared/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Base } from 'shared/base/base';
import { JOB_CITIES, JOB_TYPES, EXPERIENCE_LEVELS } from '@app/companies/enums';
import { SharedModule } from 'shared/shared-module';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { AlertsStoreService } from '../services/alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: false,
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss'
})
export class Alerts extends Base implements OnInit {
  private alertsStore = inject(AlertsStoreService);
  private fb = inject(FormBuilder);

  alerts: JobAlert[] = [];
  loading = false;
  showDialog = false;
  editingAlert: JobAlert | null = null;
  alertForm!: FormGroup;

  jobCities = JOB_CITIES;
  jobTypes = JOB_TYPES;
  experienceLevels = EXPERIENCE_LEVELS;
  categories: { id: number; name: string }[] = [];

  ngOnInit(): void {
    this.initForm();

    // Subscribe to loading state
    this.alertsStore.loadingAlerts$.subscribe(loading => {
      this.loading = loading;
    });

    // Subscribe to alerts data
    this.alertsStore.alerts$.subscribe({
      next: (data) => {
        this.alerts = data.alerts;
        this.categories = data.categories;
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.loading = false;
      }
    });

    // Subscribe to categories data
    this.alertsStore.categories$.subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });

    // Load initial data
    this.alertsStore.loadAlerts();
    this.alertsStore.loadCategories();
  }

  initForm(): void {
    this.alertForm = this.fb.group({
      title: ['', [Validators.required]],
      keywords: [''],
      city: [''],
      job_type: [''],
      experience_level: [''],
      salary_min: [null],
      category: [null],
      is_active: [true],
      email_notifications: [true]
    });
  }

  openCreateDialog(): void {
    this.editingAlert = null;
    this.alertForm.reset({
      is_active: true,
      email_notifications: true
    });
    this.showDialog = true;
  }

  openEditDialog(alert: JobAlert): void {
    this.editingAlert = alert;
    this.alertForm.patchValue({
      title: alert.title || '',
      keywords: alert.keywords || '',
      city: alert.city || '',
      job_type: alert.job_type || '',
      experience_level: alert.experience_level || '',
      salary_min: alert.salary_min || null,
      category: alert.category || null,
      is_active: alert.is_active !== undefined ? alert.is_active : true,
      email_notifications: alert.email_notifications !== undefined ? alert.email_notifications : true
    });
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.editingAlert = null;
    this.alertForm.reset({
      is_active: true,
      email_notifications: true
    });
  }

  saveAlert(): void {
    if (this.alertForm.invalid) {
      this.alertForm.markAllAsTouched();
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const formValue = this.alertForm.value;
    const payload: any = {
      title: formValue.title,
      keywords: formValue.keywords || undefined,
      city: formValue.city || undefined,
      job_type: formValue.job_type || undefined,
      experience_level: formValue.experience_level || undefined,
      salary_min: formValue.salary_min ? Number(formValue.salary_min) : undefined,
      category: formValue.category ? Number(formValue.category) : undefined,
      is_active: formValue.is_active !== undefined ? formValue.is_active : true,
      email_notifications: formValue.email_notifications !== undefined ? formValue.email_notifications : true
    };

    if (this.editingAlert) {
      // Update existing alert
      this.alertsStore.updateAlert(this.editingAlert.id, payload).subscribe({
        next: () => {
          this.toastr.success('تم تحديث التنبيه بنجاح');
          this.closeDialog();
        },
        error: (err) => {
          this.errors.error(err, { join: true });
        }
      });
    } else {
      // Create new alert
      this.alertsStore.createAlert(payload).subscribe({
        next: () => {
          this.toastr.success('تم إنشاء التنبيه بنجاح');
          this.closeDialog();
        },
        error: (err) => {
          this.errors.error(err, { join: true });
        }
      });
    }
  }

  deleteAlert(alert: JobAlert): void {
    if (confirm('هل أنت متأكد من حذف هذا التنبيه؟')) {
      this.alertsStore.deleteAlert(alert.id).subscribe({
        next: () => {
          this.toastr.success('تم حذف التنبيه بنجاح');
        },
        error: (err) => {
          this.errors.error(err, { join: true });
        }
      });
    }
  }

  toggleAlertStatus(alert: JobAlert): void {
    const payload = { is_active: !alert.is_active };
    this.alertsStore.patchAlert(alert.id, payload).subscribe({
      next: (updatedAlert) => {
        // The store will update the alert automatically
        this.toastr.success(updatedAlert.is_active ? 'تم تفعيل التنبيه' : 'تم تعطيل التنبيه');
      },
      error: (err) => {
        this.errors.error(err, { join: true });
      }
    });
  }

  getCityLabel(city: string | null | undefined): string {
    if (!city) return 'غير محدد';
    const cityOption = this.jobCities.find(c => c.value === city);
    return cityOption ? cityOption.label : city;
  }

  getJobTypeLabel(type: string | null | undefined): string {
    if (!type) return 'غير محدد';
    const typeOption = this.jobTypes.find(t => t.value === type);
    return typeOption ? typeOption.label : type;
  }

  getExperienceLevelLabel(level: string | null | undefined): string {
    if (!level) return 'غير محدد';
    const levelOption = this.experienceLevels.find(l => l.value === level);
    return levelOption ? levelOption.label : level;
  }

  getCategoryName(categoryId: number | null | undefined): string {
    if (!categoryId) return 'غير محدد';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'غير محدد';
  }
}
