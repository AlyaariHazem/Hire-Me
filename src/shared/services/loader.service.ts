import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private inFlight = 0;
  private loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loading.asObservable();

  start() {
    this.inFlight++;
    if (this.inFlight === 1) this.loading.next(true);
  }

  stop() {
    this.inFlight = Math.max(0, this.inFlight - 1);
    if (this.inFlight === 0) this.loading.next(false);
  }

  reset() {
    this.inFlight = 0;
    this.loading.next(false);
  }
}
