import { Component, OnInit, inject } from '@angular/core';
import { ApplicationService, Application, Message, CreateMessageDto } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { Errors } from 'shared/services/errors';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobseeker-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class JobseekerMessages implements OnInit {
  private applicationService = inject(ApplicationService);
  private toastr = inject(ToastrService);
  protected errors = inject(Errors);

  applications: Application[] = [];
  selectedApplication: Application | null = null;
  messages: Message[] = [];
  loading = false;
  loadingMessages = false;
  sendingMessage = false;

  // Message form
  newMessage: string = '';
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications({
      ordering: '-applied_at',
      page_size: 100
    }).subscribe({
      next: (response) => {
        this.applications = response.results || [];
        this.loading = false;
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.loading = false;
        this.applications = [];
      }
    });
  }

  selectApplication(application: Application): void {
    this.selectedApplication = application;
    this.newMessage = '';
    this.selectedFile = null;
    this.loadMessages(application.id);
    // Mark as viewed when opening
    if (!application.is_viewed) {
      this.applicationService.markApplicationAsViewed(application.id).subscribe({
        next: () => {
          application.is_viewed = true;
        },
        error: (err) => {
          console.error('Failed to mark as viewed', err);
        }
      });
    }
  }

  loadMessages(applicationId: number): void {
    this.loadingMessages = true;
    this.messages = [];
    this.applicationService.getApplicationMessages(applicationId).subscribe({
      next: (messages) => {
        // Ensure messages is always an array
        this.messages = Array.isArray(messages) ? messages : [];
        this.loadingMessages = false;
        // Scroll to bottom after loading
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.messages = [];
        this.loadingMessages = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.selectedApplication || !this.newMessage.trim() || this.sendingMessage) {
      return;
    }

    this.sendingMessage = true;
    const messageData: CreateMessageDto = {
      application: this.selectedApplication.id,
      message: this.newMessage.trim(),
      attachment: this.selectedFile ? this.selectedFile.name : null
    };

    this.applicationService.sendApplicationMessage(this.selectedApplication.id, messageData).subscribe({
      next: (message) => {
        // Ensure messages is an array before pushing
        if (!Array.isArray(this.messages)) {
          this.messages = [];
        }
        this.messages.push(message);
        this.newMessage = '';
        this.selectedFile = null;
        this.sendingMessage = false;
        this.scrollToBottom();
        this.toastr.success('تم إرسال الرسالة بنجاح');
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.sendingMessage = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  getCompanyName(application: Application): string {
    return application.job?.company?.name || 'شركة غير معروفة';
  }

  getJobTitle(application: Application): string {
    return application.job?.title || 'وظيفة غير معروفة';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
    
    return date.toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCompanyLogo(logo: string | null): string {
    if (!logo) return 'assets/images/company-placeholder.png';
    if (logo.startsWith('http')) return logo;
    return `${environment.apiBaseUrl.replace(/\/+$/, '')}/${logo.replace(/^\/+/, '')}`;
  }

  isMyMessage(message: Message): boolean {
    // For job seekers, check if message is from them (user_type should be 'job_seeker')
    return message.sender.user_type === 'job_seeker';
  }

  scrollToBottom(): void {
    const messagesContainer = document.querySelector('.messages-list');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      const span = img.nextElementSibling as HTMLElement;
      if (span) {
        span.style.display = 'flex';
      }
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'قيد المراجعة',
      reviewed: 'تم المراجعة',
      accepted: 'مقبول',
      rejected: 'مرفوض'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}

