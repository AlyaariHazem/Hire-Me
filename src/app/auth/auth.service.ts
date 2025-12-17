import { Injectable, inject } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { UserRole } from 'core/types';
import { ProfileStoreService } from 'shared/services/profile.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private profileStore = inject(ProfileStoreService);
  private router = inject(Router);
  constructor(private state: AuthStateService) {}

  // English: convenience wrappers
  isLoggedIn() { return this.state.isLoggedIn(); }   // returns boolean at call time
  get role()   { return this.state.role(); }         // current role value

  setTokens(access?: string | null, _refresh?: string | null) {
    // English: only access matters for UI state
    this.state.setAuth(access ?? null, this.state.role());
  }

  setRole(role: UserRole) {
    this.state.setAuth(this.state.token() ?? null, role);
  }

  logout() {
    // Clear auth state (removes tokens and role from localStorage and signals)
    this.state.clear();
    // Clear profile store to remove stale user data
    this.profileStore.reset();
    // Navigate to login page with full reload to clear all state/guards
    const url = this.router.serializeUrl(this.router.createUrlTree(['/login']));
    window.location.replace(url);
  }
  
}
