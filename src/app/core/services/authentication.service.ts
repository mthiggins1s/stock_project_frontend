import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class Authentication {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * POST /login
   * Sends RAW body { username, password } as Rails expects.
   * On success, automatically persists token to localStorage.
   */
  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, { username, password }).pipe(
      tap(res => {
        if (res?.token) this.setToken(res.token);
      })
    );
  }

  /**
   * POST /users
   * Rails strong params expect a WRAPPED payload: { user: {...} } with snake_case keys.
   * This method accepts either flat or wrapped data and transforms as needed.
   */
  signup(data: any) {
    // If already wrapped correctly, pass through
    if (data?.user) return this.http.post(`${this.api}/users`, data);

    // Map both snake_case and common camelCase form keys → snake_case
    const user = {
      username: data.username,
      email: data.email,
      first_name: data.first_name ?? data.firstName,
      last_name: data.last_name ?? data.lastName,
      password: data.password,
      password_confirmation: data.password_confirmation ?? data.passwordConfirmation,
    };

    return this.http.post(`${this.api}/users`, { user });
  }

  /** ---- Token helpers ---- */
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Real auth check: verifies JWT exp, not just presence.
   * Returns false if token missing, malformed, or expired.
   */
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload?.exp === 'number' && Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
