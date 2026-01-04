import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base } from 'shared/base/base';
import { DocumentsService, Document, DocumentType, VisibilityType, DocumentListResponse } from '../services/documents.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrls: ['./documents.scss']
})
export class Documents extends Base implements OnInit {
  private documentsService = inject(DocumentsService);
  private fb = inject(FormBuilder);

  documents: Document[] = [];
  isLoading = false;
  showDialog = false;
  isEditing = false;
  editingDocumentId: number | null = null;
  searchTerm = '';
  currentPage = 1;
  totalCount = 0;
  hasNext = false;
  hasPrevious = false;

  documentForm!: FormGroup;
  selectedFile: File | null = null;
  filePreviewUrl: string | null = null;

  // Document type options
  documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'certificate', label: 'شهادة أكاديمية' },
    { value: 'training', label: 'شهادة دورة تدريبية' },
    { value: 'project', label: 'مشروع' },
    { value: 'recommendation', label: 'خطاب توصية' },
    { value: 'award', label: 'جائزة أو تكريم' },
    { value: 'other', label: 'أخرى' }
  ];

  // Visibility options
  visibilityOptions: { value: VisibilityType; label: string; description: string }[] = [
    { value: 'public', label: 'عام', description: 'يمكن لأي صاحب عمل المشاهدة' },
    { value: 'private', label: 'خاص', description: 'فقط أنا' },
    { value: 'employers_only', label: 'أصحاب العمل فقط', description: 'عند التقديم' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadDocuments();
  }

  initForm(): void {
    this.documentForm = this.fb.group({
      document_type: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      file: [null, Validators.required],
      issued_by: ['', Validators.maxLength(200)],
      issue_date: [''],
      visibility: ['public', Validators.required]
    });
  }

  loadDocuments(): void {
    this.isLoading = true;
    const params: any = {
      page: this.currentPage
    };
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }

    this.documentsService.getDocuments(params).subscribe({
      next: (response: DocumentListResponse) => {
        // Handle both 'results' and 'data' response formats
        this.documents = response.results || response.data || [];
        this.totalCount = response.count || this.documents.length;
        this.hasNext = !!response.next;
        this.hasPrevious = !!response.previous;
        this.isLoading = false;
        console.log('Documents loaded:', this.documents);
      },
      error: (err) => {
        console.error('Error loading documents:', err);
        this.errors.error(err, { join: true });
        this.isLoading = false;
        this.documents = [];
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadDocuments();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile = file;

    // Clean up previous blob URL if it exists
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }

    if (file) {
      // Create blob URL for preview
      this.filePreviewUrl = URL.createObjectURL(file);
      this.documentForm.patchValue({ file: file.name });
    } else {
      // If editing and no new file selected, keep the existing file URL
      if (this.isEditing && this.editingDocumentId) {
        // Keep the existing preview URL
        return;
      }
      this.filePreviewUrl = null;
      this.documentForm.patchValue({ file: null });
    }
  }

  openCreateDialog(): void {
    this.isEditing = false;
    this.editingDocumentId = null;
    this.selectedFile = null;
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    this.filePreviewUrl = null;
    this.documentForm.reset({
      document_type: '',
      title: '',
      description: '',
      file: null,
      issued_by: '',
      issue_date: '',
      visibility: 'public'
    });
    // Reset file input after dialog opens
    setTimeout(() => {
      const fileInput = (window.document.getElementById('file') as HTMLInputElement);
      if (fileInput) {
        fileInput.value = '';
      }
    }, 0);
    this.showDialog = true;
  }

  openEditDialog(document: Document): void {
    this.isEditing = true;
    this.editingDocumentId = document.id;
    this.selectedFile = null;
    
    // Clean up any existing blob URL
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    
    // Set preview URL to existing document file
    this.filePreviewUrl = document.file_url || this.toAbsolute(document.file) || null;

    this.documentForm.patchValue({
      document_type: document.document_type,
      title: document.title,
      description: document.description || '',
      file: document.file_name || document.file,
      issued_by: document.issued_by || '',
      issue_date: document.issue_date || '',
      visibility: document.visibility
    });
    
    // Reset file input after dialog opens
    setTimeout(() => {
      const fileInput = (window.document.getElementById('file') as HTMLInputElement);
      if (fileInput) {
        fileInput.value = '';
      }
    }, 0);
    
    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.isEditing = false;
    this.editingDocumentId = null;
    this.selectedFile = null;
    if (this.filePreviewUrl && !this.filePreviewUrl.startsWith('http')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    this.filePreviewUrl = null;
    this.documentForm.reset();
  }

  saveDocument(): void {
    if (this.documentForm.invalid) {
      this.toastr.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!this.isEditing && !this.selectedFile) {
      this.toastr.error('يرجى اختيار ملف');
      return;
    }

    const formValue = this.documentForm.value;
    const formData = new FormData();

    // Add file if it's a new document or if file was changed
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Add other fields
    formData.append('document_type', formValue.document_type);
    formData.append('title', formValue.title);
    if (formValue.description) {
      formData.append('description', formValue.description);
    }
    if (formValue.issued_by) {
      formData.append('issued_by', formValue.issued_by);
    }
    if (formValue.issue_date) {
      formData.append('issue_date', formValue.issue_date.toISOString());
    }
    formData.append('visibility', formValue.visibility);

    if (this.isEditing && this.editingDocumentId) {
      // Update existing document
      this.documentsService.partialUpdateDocument(this.editingDocumentId, formData).subscribe({
        next: () => {
          this.toastr.success('تم تحديث الوثيقة بنجاح');
          this.closeDialog();
          this.loadDocuments();
        },
        error: (err) => {
          this.errors.error(err, { join: true });
        }
      });
    } else {
      // Create new document
      this.documentsService.createDocument(formData).subscribe({
        next: () => {
          this.toastr.success('تم إضافة الوثيقة بنجاح');
          this.closeDialog();
          this.loadDocuments();
        },
        error: (err) => {
          this.errors.error(err, { join: true });
        }
      });
    }
  }

  deleteDocument(id: number): void {
    if (!confirm('هل أنت متأكد من حذف هذه الوثيقة؟')) {
      return;
    }

    this.documentsService.deleteDocument(id).subscribe({
      next: () => {
        this.toastr.success('تم حذف الوثيقة بنجاح');
        this.loadDocuments();
      },
      error: (err) => {
        this.errors.error(err, { join: true });
      }
    });
  }

  getDocumentTypeLabel(type: DocumentType): string {
    const docType = this.documentTypes.find(dt => dt.value === type);
    return docType?.label || type;
  }

  getVisibilityLabel(visibility: VisibilityType): string {
    const vis = this.visibilityOptions.find(v => v.value === visibility);
    return vis?.label || visibility;
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getFileUrl(document: Document): string {
    if (document.file_url) {
      return document.file_url;
    }
    return this.toAbsolute(document.file) || '#';
  }

  toAbsolute(path?: string | null): string | null {
    if (!path) return null;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    const base = environment.apiBaseUrl.replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadDocuments();
  }

  // Expose Math for template
  Math = Math;

  getFileName(): string {
    if (this.selectedFile) {
      return this.selectedFile.name;
    }
    if (this.isEditing && this.filePreviewUrl) {
      // Extract filename from URL or use a default
      const urlParts = this.filePreviewUrl.split('/');
      return urlParts[urlParts.length - 1] || 'الملف الحالي';
    }
    return 'معاينة الملف';
  }

  getFileIconClass(): string {
    if (!this.selectedFile && !this.filePreviewUrl) return '';
    const fileName = this.selectedFile?.name || this.filePreviewUrl || '';
    if (fileName.toLowerCase().endsWith('.pdf')) return 'pi-file-pdf';
    if (fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) return 'pi-image';
    if (fileName.toLowerCase().match(/\.(doc|docx)$/)) return 'pi-file-word';
    return 'pi-file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  previewFile(event: Event): void {
    event.preventDefault();
    if (this.filePreviewUrl) {
      window.open(this.filePreviewUrl, '_blank', 'noopener,noreferrer');
    }
  }

  ngOnDestroy(): void {
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
  }
}

