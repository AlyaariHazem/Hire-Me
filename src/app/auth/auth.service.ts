import { Injectable } from '@angular/core';
import { AuthStateService } from './auth-state.service';
import { UserRole } from 'core/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
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

  logout() { this.state.clear(); }
}
