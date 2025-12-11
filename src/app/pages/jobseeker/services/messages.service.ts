import { Injectable, inject } from '@angular/core';
import { Subject, Observable, exhaustMap, tap, shareReplay, map, catchError, of, BehaviorSubject, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApplicationService, Application, Message, MessageListResponse } from 'shared/services/application.service';

export interface MessagesData {
  applications: Application[];
  selectedApplication: Application | null;
  messages: Message[];
  loadingApplications: boolean;
  loadingMessages: boolean;
}

@Injectable({ providedIn: 'root' })
export class MessagesStoreService {
  private applicationService = inject(ApplicationService);

  // Trigger for loading applications
  private readonly applicationsTrigger$ = new Subject<void>();

  // Trigger for loading messages (with applicationId)
  private readonly messagesTrigger$ = new Subject<number>();

  // Loading states
  private loadingApplicationsSubject = new BehaviorSubject<boolean>(false);
  readonly loadingApplications$ = this.loadingApplicationsSubject.asObservable();

  private loadingMessagesSubject = new BehaviorSubject<boolean>(false);
  readonly loadingMessages$ = this.loadingMessagesSubject.asObservable();

  // Track if data has been loaded
  private applicationsLoaded = false;

  // Messages data observable with BehaviorSubject to cache last value
  private messagesDataSubject = new BehaviorSubject<MessagesData>({
    applications: [],
    selectedApplication: null,
    messages: [],
    loadingApplications: false,
    loadingMessages: false
  });

  readonly messages$: Observable<MessagesData> = this.messagesDataSubject.asObservable();

  // Signal for templates
  readonly messages = toSignal(this.messages$, {
    initialValue: {
      applications: [],
      selectedApplication: null,
      messages: [],
      loadingApplications: false,
      loadingMessages: false
    } as MessagesData
  });

  // Snapshot for synchronous access
  get snapshot(): MessagesData {
    return { ...this.messagesDataSubject.value };
  }

  /**
   * Load applications from backend
   */
  private loadApplicationsData(): Observable<Application[]> {
    return this.applicationService.getMyApplications({
      ordering: '-applied_at',
      pageSize: 100
    }).pipe(
      map((response) => response.results || []),
      catchError((err) => {
        console.error('Failed to load applications', err);
        return of([]);
      })
    );
  }

  /**
   * Load messages for an application
   */
  private loadMessagesData(applicationId: number): Observable<Message[]> {
    return this.applicationService.getApplicationMessages(applicationId).pipe(
      map((messages: Message[]) => {
        // Ensure messages is always an array
        return Array.isArray(messages) ? messages : [];
      }),
      catchError((err) => {
        console.error('Failed to load messages', err);
        return of([]);
      })
    );
  }

  /**
   * Applications observable (private, used internally)
   */
  private applicationsList$: Observable<Application[]> = this.applicationsTrigger$.pipe(
    exhaustMap(() => {
      this.loadingApplicationsSubject.next(true);
      return this.loadApplicationsData();
    }),
    tap((applications) => {
      this.applicationsLoaded = true;
      this.loadingApplicationsSubject.next(false);
      // Update messages data with new applications
      const currentData = this.messagesDataSubject.value;
      this.messagesDataSubject.next({
        ...currentData,
        applications,
        loadingApplications: false
      });
    }),
    startWith(this.messagesDataSubject.value.applications),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Keep subscription alive to ensure observable stays active
  private applicationsSubscription = this.applicationsList$.subscribe();

  /**
   * Messages observable for selected application (private, used internally)
   */
  private messagesForApplication$: Observable<Message[]> = this.messagesTrigger$.pipe(
    exhaustMap((applicationId) => {
      this.loadingMessagesSubject.next(true);
      return this.loadMessagesData(applicationId);
    }),
    tap((messages) => {
      this.loadingMessagesSubject.next(false);
      // Update messages data with new messages
      const currentData = this.messagesDataSubject.value;
      this.messagesDataSubject.next({
        ...currentData,
        messages,
        loadingMessages: false
      });
    }),
    startWith([]),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Keep subscription alive to ensure observable stays active
  private messagesSubscription = this.messagesForApplication$.subscribe();

  /**
   * Load applications
   */
  loadApplications(): void {
    // Only trigger if not already loaded
    if (!this.applicationsLoaded) {
      this.applicationsTrigger$.next();
    }
  }

  /**
   * Select an application and load its messages
   */
  selectApplication(application: Application): void {
    const currentData = this.messagesDataSubject.value;
    
    // Update selected application
    this.messagesDataSubject.next({
      ...currentData,
      selectedApplication: application,
      messages: [] // Clear previous messages
    });

    // Load messages for this application
    this.loadMessages(application.id);

    // Mark as viewed if not already viewed
    if (!application.is_viewed) {
      this.applicationService.markApplicationAsViewed(application.id).subscribe({
        next: () => {
          // Update application in the list
          const updatedApplications = currentData.applications.map(app =>
            app.id === application.id ? { ...app, is_viewed: true } : app
          );
          this.messagesDataSubject.next({
            ...currentData,
            applications: updatedApplications,
            selectedApplication: { ...application, is_viewed: true }
          });
        },
        error: (err) => {
          console.error('Failed to mark as viewed', err);
        }
      });
    }
  }

  /**
   * Load messages for an application
   */
  loadMessages(applicationId: number): void {
      this.messagesTrigger$.next(applicationId);
  }

  /**
   * Send a message
   */
  sendMessage(applicationId: number, messageData: FormData): Observable<Message> {
    return this.applicationService.sendApplicationMessage(applicationId, messageData).pipe(
      tap((message) => {
        // Add message to current list
        const currentData = this.messagesDataSubject.value;
        const updatedMessages = [...currentData.messages, message];
        this.messagesDataSubject.next({
          ...currentData,
          messages: updatedMessages
        });
      })
    );
  }

  /**
   * Clear selected application and messages
   */
  clearSelection(): void {
    const currentData = this.messagesDataSubject.value;
    this.messagesDataSubject.next({
      ...currentData,
      selectedApplication: null,
      messages: []
    });
  }

  /**
   * Refresh applications list
   */
  refreshApplications(): void {
    this.applicationsLoaded = false;
    this.loadApplications();
  }

  /**
   * Refresh messages for current application
   */
  refreshMessages(): void {
    const currentData = this.messagesDataSubject.value;
    if (currentData.selectedApplication) {
      this.loadMessages(currentData.selectedApplication.id);
    }
  }

  /**
   * Reset store to initial state
   */
  reset(): void {
    this.applicationsLoaded = false;
    this.loadingApplicationsSubject.next(false);
    this.loadingMessagesSubject.next(false);
    this.messagesDataSubject.next({
      applications: [],
      selectedApplication: null,
      messages: [],
      loadingApplications: false,
      loadingMessages: false
    });
  }
}

