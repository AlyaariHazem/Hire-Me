import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

export type DocumentType = 'certificate' | 'training' | 'project' | 'recommendation' | 'award' | 'other';
export type VisibilityType = 'public' | 'private' | 'employers_only';

export interface Document {
  id: number;
  document_type: DocumentType;
  title: string;
  description?: string | null;
  file: string;
  file_url?: string;
  file_size?: string;
  file_name?: string;
  issued_by?: string | null;
  issue_date?: string | null;
  visibility: VisibilityType;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentListResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Document[];
  data?: Document[]; // Some APIs return data instead of results
}

export interface CreateDocumentPayload {
  document_type: DocumentType;
  title: string;
  description?: string | null;
  file: string; // URI
  issued_by?: string | null;
  issue_date?: string | null;
  visibility: VisibilityType;
}

export interface UpdateDocumentPayload extends Partial<CreateDocumentPayload> {}

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private http = inject(HttpClient);

  /**
   * Get list of documents with pagination and search
   */
  getDocuments(params?: {
    ordering?: string;
    page?: number;
    search?: string;
  }): Observable<DocumentListResponse> {
    let httpParams = new HttpParams();
    if (params?.ordering) {
      httpParams = httpParams.set('ordering', params.ordering);
    }
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }

    const url = environment.getUrl('profile/documents', 'accounts');
    return this.http.get<DocumentListResponse>(url, { params: httpParams });
  }

  /**
   * Get a single document by ID
   */
  getDocument(id: number): Observable<Document> {
    const url = environment.getUrl(`profile/documents/${id}`, 'accounts');
    return this.http.get<Document>(url);
  }

  /**
   * Create a new document
   */
  createDocument(payload: CreateDocumentPayload | FormData): Observable<Document> {
    const url = environment.getUrl('profile/documents', 'accounts');
    return this.http.post<Document>(url, payload);
  }

  /**
   * Update a document (full update)
   */
  updateDocument(id: number, payload: UpdateDocumentPayload | FormData): Observable<Document> {
    const url = environment.getUrl(`profile/documents/${id}`, 'accounts');
    return this.http.put<Document>(url, payload);
  }

  /**
   * Partial update a document
   */
  partialUpdateDocument(id: number, payload: Partial<UpdateDocumentPayload> | FormData): Observable<Document> {
    const url = environment.getUrl(`profile/documents/${id}`, 'accounts');
    return this.http.patch<Document>(url, payload);
  }

  /**
   * Delete a document
   */
  deleteDocument(id: number): Observable<void> {
    const url = environment.getUrl(`profile/documents/${id}`, 'accounts');
    return this.http.delete<void>(url);
  }

  /**
   * Log document view (for employers viewing documents)
   */
  logDocumentView(documentId: number): Observable<void> {
    // Correct endpoint: /api/applications/documents/{document_id}/log-view/
    const url = environment.getUrl(`documents/${documentId}/log-view`, 'applications');
    return this.http.post<void>(url, {});
  }
}

