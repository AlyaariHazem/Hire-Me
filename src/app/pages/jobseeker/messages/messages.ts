import { Component, OnInit, inject } from '@angular/core';
import { Application, Message } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { Errors } from 'shared/services/errors';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessagesStoreService } from '../services/messages.service';

@Component({
  selector: 'app-jobseeker-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class JobseekerMessages implements OnInit {
  private messagesStore = inject(MessagesStoreService);
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
    // Subscribe to loading states
    this.messagesStore.loadingApplications$.subscribe(loading => {
      this.loading = loading;
    });

    this.messagesStore.loadingMessages$.subscribe(loading => {
      this.loadingMessages = loading;
    });

    // Subscribe to messages data
    this.messagesStore.messages$.subscribe({
      next: (data) => {
        this.applications = data.applications;
        this.selectedApplication = data.selectedApplication;
        this.messages = data.messages;
        // Scroll to bottom after messages load
        if (data.messages.length > 0) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      },
      error: (err) => {
        this.errors.error(err, { join: true });
      }
    });

    // Load initial applications
    this.messagesStore.loadApplications();
  }

  selectApplication(application: Application): void {
    this.newMessage = '';
    this.selectedFile = null;
    // Clear file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.messagesStore.selectApplication(application);
  }

  sendMessage(): void {
    if (!this.selectedApplication || !this.newMessage.trim() || this.sendingMessage) {
      if (!this.newMessage.trim()) {
        this.toastr.warning('يرجى إدخال رسالة');
      }
      return;
    }

    this.sendingMessage = true;
    
    // Use FormData to support file uploads
    const formData = new FormData();
    formData.append('application', this.selectedApplication.id.toString());
    formData.append('message', this.newMessage.trim() || '');
    
    // Append file if selected
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile, this.selectedFile.name);
    }

    this.messagesStore.sendMessage(this.selectedApplication.id, formData).subscribe({
      next: (message) => {
        this.newMessage = '';
        this.selectedFile = null;
        // Clear file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
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
      const file = input.files[0];
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];

      // Validate file size
      if (file.size > maxFileSize) {
        this.toastr.error('حجم الملف يتجاوز 10MB');
        input.value = '';
        this.selectedFile = null;
        return;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error('صيغة الملف غير مدعومة. يرجى رفع ملف PDF, DOC, DOCX, أو صورة.');
        input.value = '';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      console.log('File selected:', file.name, file.size, file.type); // Debug
    } else {
      this.selectedFile = null;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    // Clear file input
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
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

  isImageAttachment(attachmentUrl: string | null | undefined): boolean {
    if (!attachmentUrl) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const url = attachmentUrl.toLowerCase();
    return imageExtensions.some(ext => url.includes(ext));
  }

  getAttachmentUrl(attachmentUrl: string | null | undefined): string {
    if (!attachmentUrl) return '';
    if (attachmentUrl.startsWith('http') || attachmentUrl.startsWith('blob:') || attachmentUrl.startsWith('data:')) {
      return attachmentUrl;
    }
    return `${environment.apiBaseUrl.replace(/\/+$/, '')}/${attachmentUrl.replace(/^\/+/, '')}`;
  }

  openImageInNewTab(attachmentUrl: string | null | undefined): void {
    if (attachmentUrl) {
      window.open(this.getAttachmentUrl(attachmentUrl), '_blank');
    }
  }

  handleAttachmentError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
      // Show fallback link
      const link = img.nextElementSibling as HTMLElement;
      if (link) {
        link.style.display = 'block';
      }
    }
  }
}

