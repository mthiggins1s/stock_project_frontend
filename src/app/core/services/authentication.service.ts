import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * POST /login
   * Accepts username OR email + password.
   * Rails backend will handle finding the user.
   */
  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { usernameOrEmail, password }).pipe(
      tap(res => {
        if (res?.token) this.setToken(res.token);
      })
    );
  }

  /**
   * POST /users (signup)
   */
  signup(data: any) {
    if (data?.user) return this.http.post(`${this.api}/users`, data);

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
