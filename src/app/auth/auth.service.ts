import { Injectable } from '@angular/core';

type Role = 'jobseeker' | 'employer';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private ACCESS_KEY = 'access';
  private REFRESH_KEY = 'refresh';
  private ROLE_KEY = 'role';

  setTokens(access: string, refresh?: string) {
    localStorage.setItem(this.ACCESS_KEY, access);
    if (refresh) localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  setRole(role: Role) {
    localStorage.setItem(this.ROLE_KEY, role);
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  get role(): Role | null {
    const r = localStorage.getItem(this.ROLE_KEY);
    return r === 'employer' || r === 'jobseeker' ? r : null;
  }

  isLoggedIn(): boolean {
    // If you have JWTs and want expiry checks, decode & validate here.
    return !!this.accessToken;
  }

  logout() {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.ROLE_KEY);
  }
}
