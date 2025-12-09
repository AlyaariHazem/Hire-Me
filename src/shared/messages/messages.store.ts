import { Injectable, computed, inject, signal } from '@angular/core';
import { ApplicationService, Application, Message } from 'shared/services/application.service';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface SharedMessagesState {
  applications: Application[];
  selectedApplication: Application | null;
  messages: Message[];
  loading: boolean;
  loadingMessages: boolean;
  loadingMore: boolean;
  page: number;
  pageSize: number;
  hasNext: boolean;
  nextPageUrl: string | null;
  loaded: boolean; // Initial load flag
}

@Injectable({ providedIn: 'root' })
export class SharedMessagesStoreService {
  private applicationService = inject(ApplicationService);

  private initialState: SharedMessagesState = {
    applications: [],
    selectedApplication: null,
    messages: [],
    loading: false,
    loadingMessages: false,
    loadingMore: false,
    page: 1,
    pageSize: 5,
    hasNext: false,
    nextPageUrl: null,
    loaded: false
  };

  private state = signal<SharedMessagesState>(this.initialState);

  // Selectors
  readonly applications = computed(() => this.state().applications);
  readonly selectedApplication = computed(() => this.state().selectedApplication);
  readonly messages = computed(() => this.state().messages);
  readonly loading = computed(() => this.state().loading);
  readonly loadingMessages = computed(() => this.state().loadingMessages);
  readonly loadingMore = computed(() => this.state().loadingMore);
  readonly hasNext = computed(() => this.state().hasNext);
  readonly page = computed(() => this.state().page);

  constructor() {}

  init(): void {
    if (!this.state().loaded) {
      this.loadApplications();
    }
  }

  loadApplications(): void {
    this.patchState({ loading: true, page: 1, applications: [], hasNext: false, nextPageUrl: null });
    this.applicationService.getAllJobApplications({
      ordering: '-applied_at',
      page: 1,
      page_size: this.state().pageSize
    }).subscribe({
      next: (response) => {
        this.patchState({
          applications: response.results || [],
          hasNext: !!response.next,
          nextPageUrl: response.next,
          loading: false,
          loaded: true
        });
      },
      error: (err) => {
        console.error('Failed to load applications', err);
        this.patchState({ loading: false, applications: [] });
      }
    });
  }

  loadMoreApplications(): void {
    const currentState = this.state();
    if (!currentState.hasNext || currentState.loadingMore) return;

    this.patchState({ loadingMore: true });
    const nextPage = currentState.page + 1;

    this.applicationService.getAllJobApplications({
      ordering: '-applied_at',
      page: nextPage,
      page_size: currentState.pageSize
    }).subscribe({
      next: (response) => {
        this.patchState({
          applications: [...currentState.applications, ...(response.results || [])],
          hasNext: !!response.next,
          nextPageUrl: response.next,
          page: nextPage,
          loadingMore: false
        });
      },
      error: (err) => {
        console.error('Failed to load more applications', err);
        this.patchState({ loadingMore: false });
      }
    });
  }

  selectApplication(application: Application): void {
    this.patchState({ selectedApplication: application });
    this.loadMessages(application.id);
    
    // Mark as viewed side-effect can happen here or in component. 
    // Doing it here keeps component logic simpler.
    if (!application.is_viewed) {
      this.applicationService.markApplicationAsViewed(application.id).subscribe({
        next: () => {
           // We could update the specific application in the list if we want purely immutable state
           const apps = this.state().applications.map(a => 
             a.id === application.id ? { ...a, is_viewed: true } : a
           );
           this.patchState({ applications: apps, selectedApplication: { ...application, is_viewed: true } });
        },
        error: err => console.error('Failed to mark viewed', err)
      });
    }
  }

  loadMessages(applicationId: number): void {
    this.patchState({ loadingMessages: true, messages: [] });
    this.applicationService.getApplicationMessages(applicationId).subscribe({
      next: (messages) => {
        this.patchState({
          messages: Array.isArray(messages) ? messages : [],
          loadingMessages: false
        });
      },
      error: (err) => {
        console.error('Failed to load messages', err);
        this.patchState({ messages: [], loadingMessages: false });
      }
    });
  }

  sendMessage(applicationId: number, formData: FormData): Observable<Message> {
    // Note: sendingMessage loading state is usually local to component (button spinner), 
    // so we don't necessarily need it in global store, or we can return observable to let component handle it.
    return this.applicationService.sendApplicationMessage(applicationId, formData).pipe(
      tap((message) => {
        const currentMessages = this.state().messages;
        this.patchState({ messages: [...currentMessages, message] });
      })
    );
  }

  private patchState(partialState: Partial<SharedMessagesState>) {
    this.state.update(state => ({ ...state, ...partialState }));
  }
}
