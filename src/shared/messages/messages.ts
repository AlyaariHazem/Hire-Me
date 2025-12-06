import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ApplicationService, Application, Message, CreateMessageDto } from 'shared/services/application.service';
import { ToastrService } from 'ngx-toastr';
import { Errors } from 'shared/services/errors';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class Messages implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('applicationsList', { static: false }) applicationsListRef!: ElementRef<HTMLElement>;

  private applicationService = inject(ApplicationService);
  private toastr = inject(ToastrService);
  protected errors = inject(Errors);
  private cdr = inject(ChangeDetectorRef);

  applications: Application[] = [];
  selectedApplication: Application | null = null;
  messages: Message[] = [];
  loading = false;
  loadingMessages = false;
  loadingMore = false;
  sendingMessage = false;

  // Pagination
  currentPage = 1;
  pageSize = 5; // Show 5 initially
  hasNext = false;
  nextPageUrl: string | null = null;

  // Message form
  newMessage: string = '';
  selectedFile: File | null = null;

  private scrollHandler = this.onScroll.bind(this);

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit(): void {
    // Force change detection
    this.cdr.detectChanges();
    
    // Setup scroll listener after view is initialized
    // Use multiple timeouts to ensure DOM is ready
    setTimeout(() => {
      this.setupScrollListener();
      // Also check if we need to load more immediately if content is too short
      this.checkIfNeedMoreContent();
    }, 500);
  }

  checkIfNeedMoreContent(): void {
    if (this.applicationsListRef?.nativeElement) {
      const element = this.applicationsListRef.nativeElement;
      // If content doesn't fill the container and we have more pages, load more
      if (element.scrollHeight <= element.clientHeight && this.hasNext && !this.loadingMore) {
        console.log('Content too short, loading more...'); // Debug
        this.loadMoreApplications();
      }
    }
  }

  ngOnDestroy(): void {
    // Clean up scroll listener
    this.removeScrollListener();
  }

  setupScrollListener(): void {
    // Force change detection first
    this.cdr.detectChanges();
    
    // Wait for view to update, then setup listener
    setTimeout(() => {
      // Try to get element directly if ViewChild is not ready
      let element: HTMLElement | null = null;
      
      if (this.applicationsListRef?.nativeElement) {
        element = this.applicationsListRef.nativeElement;
      } else {
        // Fallback: try to find element by class
        element = document.querySelector('.applications-list') as HTMLElement;
      }
      
      if (element) {
        // Remove existing listener if any
        element.removeEventListener('scroll', this.scrollHandler);
        // Add new listener
        element.addEventListener('scroll', this.scrollHandler, { passive: true });
        const hasScroll = element.scrollHeight > element.clientHeight;
        console.log('Scroll listener setup on:', element, {
          hasScroll,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
          scrollTop: element.scrollTop,
          applicationsCount: this.applications.length,
          hasNext: this.hasNext
        }); // Debug
        
        // Also check if we need to load more immediately
        if (!hasScroll && this.hasNext && !this.loadingMore) {
          console.log('No scroll needed, but has more data. Loading...'); // Debug
          this.loadMoreApplications();
        }
      } else {
        console.warn('applicationsListRef is not available, retrying...'); // Debug
        // Retry after a bit more time
        setTimeout(() => this.setupScrollListener(), 300);
      }
    }, 100);
  }

  removeScrollListener(): void {
    if (this.applicationsListRef?.nativeElement) {
      this.applicationsListRef.nativeElement.removeEventListener('scroll', this.scrollHandler);
    }
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target) {
      console.warn('Scroll event target is null'); // Debug
      return;
    }

    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // Only log occasionally to avoid spam
    if (Math.random() < 0.1) { // Log 10% of scroll events
      console.log('Scroll event:', { scrollTop, scrollHeight, clientHeight, distanceFromBottom, hasNext: this.hasNext, loadingMore: this.loadingMore }); // Debug
    }

    // Load more when user scrolls near bottom (within 150px for better trigger)
    if (distanceFromBottom < 150 && this.hasNext && !this.loadingMore) {
      console.log('Triggering loadMoreApplications...', { distanceFromBottom, hasNext: this.hasNext, loadingMore: this.loadingMore }); // Debug
      this.loadMoreApplications();
    }
  }

  loadApplications(): void {
    this.loading = true;
    this.currentPage = 1;
    this.applications = [];
    this.hasNext = false;
    this.nextPageUrl = null;
    
    this.applicationService.getAllJobApplications({
      ordering: '-applied_at',
      page: 1,
      page_size: this.pageSize
    }).subscribe({
      next: (response) => {
        console.log('Applications response:', response); // Debug
        this.applications = response.results || [];
        this.hasNext = !!response.next;
        this.nextPageUrl = response.next;
        this.loading = false;
        
        // Force change detection
        this.cdr.detectChanges();
        
        // Re-setup scroll listener after data loads and view updates
        setTimeout(() => {
          this.setupScrollListener();
          this.checkIfNeedMoreContent();
        }, 300);
      },
      error: (err) => {
        this.errors.error(err, { join: true });
        this.loading = false;
        this.applications = [];
      }
    });
  }

  loadMoreApplications(): void {
    if (!this.hasNext || this.loadingMore) {
      console.log('Cannot load more:', { hasNext: this.hasNext, loadingMore: this.loadingMore }); // Debug
      return;
    }

    this.loadingMore = true;
    this.currentPage++;
    
    console.log('Loading page:', this.currentPage, 'pageSize:', this.pageSize); // Debug
    
    this.applicationService.getAllJobApplications({
      ordering: '-applied_at',
      page: this.currentPage,
      page_size: this.pageSize
    }).subscribe({
      next: (response) => {
        console.log('More applications loaded:', response.results?.length, 'Total now:', this.applications.length + (response.results?.length || 0)); // Debug
        const newApplications = response.results || [];
        this.applications = [...this.applications, ...newApplications];
        this.hasNext = !!response.next;
        this.nextPageUrl = response.next;
        this.loadingMore = false;
        
        // Force change detection
        this.cdr.detectChanges();
        
        // Re-setup scroll listener after new data is loaded
        setTimeout(() => {
          this.setupScrollListener();
          this.checkIfNeedMoreContent();
        }, 300);
      },
      error: (err) => {
        console.error('Error loading more applications:', err); // Debug
        this.errors.error(err, { join: true });
        this.loadingMore = false;
        this.currentPage--; // Revert page increment on error
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

    this.applicationService.sendApplicationMessage(this.selectedApplication.id, formData).subscribe({
      next: (message) => {
        // Ensure messages is an array before pushing
        if (!Array.isArray(this.messages)) {
          this.messages = [];
        }
        this.messages.push(message);
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

  getApplicantName(application: Application): string {
    if (application.applicant) {
      const firstName = application.applicant.first_name || '';
      const lastName = application.applicant.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || application.applicant.email || application.applicant.username || 'مقدم طلب غير معروف';
    }
    return 'مقدم طلب غير معروف';
  }

  getApplicantInitials(application: Application): string {
    if (application.applicant) {
      const firstName = application.applicant.first_name || '';
      const lastName = application.applicant.last_name || '';
      if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      }
      if (firstName) {
        return firstName.charAt(0).toUpperCase();
      }
      if (application.applicant.email) {
        return application.applicant.email.charAt(0).toUpperCase();
      }
    }
    return '?';
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

  getProfilePicture(picture: string | null): string {
    if (!picture) return '';
    if (picture.startsWith('http')) return picture;
    return `${environment.apiBaseUrl.replace(/\/+$/, '')}/${picture.replace(/^\/+/, '')}`;
  }

  isMyMessage(message: Message): boolean {
    // Check if message is from current user (employer)
    // You may need to adjust this based on your auth service
    return message.sender.user_type === 'employer' || message.sender.user_type === 'company';
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
