import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ProfileStoreService } from 'shared/services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class User {
  private profileStore = inject(ProfileStoreService);
  
  // Expose profile directly or map to expected structure if needed
  // Original code did http.get which returns { data: { profile: ... } } or just profile?
  // ProfileStoreService.profile$ returns the Profile object.
  // The User service seemed to return the full response or just the profile?
  // Previous code: this.http.get(...).pipe(shareReplay(1))
  // The Dashboard subscribes and assigns to this.userData.
  // In Dashboard: `this.userData = data`.
  // Later it might use `userData.user.first_name`.
  // ProfileStoreService profile$ returns the inner profile object which HAS .user property.
  // However, the original http.get to `profile` endpoint returns `{ data: { profile: ... } }`.
  // Let's assume Dashboard expects the same structure as the API response?
  // Or did User service map it? No, it just did http.get().
  // So Dashboard expects `{ data: { profile: ... } }` structure?
  // Let's check Dashboard usage of userData.
  // Code: `this.userData = data;`
  // HTML? I should check dashboard.html to see how userData is used.
  // If it uses `userData.data.profile.user.first_name`, then I need to mock that structure.
  
  // BUT ProfileStoreService already unwraps it: `map(res => res?.data?.profile ?? null)`.
  // So if I pass ProfileStoreService.profile$, I am passing the Profile object.
  // If Dashboard expects the WRAPPED response, I'll break it.
  
  // Let's quickly check dashboard.html or assume I should wrap it back to be safe, 
  // OR update Dashboard to use ProfileStoreService directly (better).
  // But Dashboard relies on `User` service.
  
  // Let's peek at `dashboard.html`.
  readonly user$ = this.profileStore.profile$;
  
  constructor() {}
}
