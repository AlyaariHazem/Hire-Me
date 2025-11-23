import { Injectable, signal, computed } from '@angular/core';

import { UserRole } from 'core/types';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  // English: token + role are signals so templates re-render when they change
  private readonly _token = signal<string | null>(localStorage.getItem('access'));
  private readonly _role  = signal<UserRole>(localStorage.getItem('role') as UserRole);

  // English: expose as readable signals
  readonly token = computed(() => this._token());
  readonly role  = computed(() => this._role());

  // English: derived signal
  readonly isLoggedIn = computed(() => !!this._token());

  // English: setter that also persists to localStorage
  setAuth(token: string | null, role: UserRole | null) {
    // Token
    if (token) localStorage.setItem('access', token);
    else localStorage.removeItem('access');
    this._token.set(token);

    // Role
    const r = role ?? '';
    if (r) localStorage.setItem('role', r);
    else localStorage.removeItem('role');
    this._role.set(r);
  }

  clear() {
    this.setAuth(null, null);
  }
}
