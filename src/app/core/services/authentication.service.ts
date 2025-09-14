import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

type LoginResponse = { token: string };

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  public_id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly api = environment.apiUrl;
  private currentUser: User | null = null;   // 👈 cached user
  private userRequest$: Observable<User> | null = null; // 👈 prevent duplicate calls

  constructor(private http: HttpClient, private router: Router) {}

  // ---- Auth ----
  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.api}/login`, { usernameOrEmail, password })
      .pipe(
        tap(res => {
          if (res?.token) {
            this.setToken(res.token);
            this.currentUser = null; // reset cache after login
          }
        })
      );
  }

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

  // ---- User ----
  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      // ✅ return cached user
      return of(this.currentUser);
    }
    if (this.userRequest$) {
      // ✅ if already fetching, reuse that request
      return this.userRequest$;
    }

    // ✅ first fetch from API
    this.userRequest$ = this.http.get<User>(`${this.api}/me`).pipe(
      tap(user => {
        this.currentUser = user;
        this.userRequest$ = null; // reset once complete
      }),
      shareReplay(1)
    );

    return this.userRequest$;
  }

  getCachedUser(): User | null {
    return this.currentUser;
  }

  clearUserCache() {
    this.currentUser = null;
    this.userRequest$ = null;
  }

  // ---- Token ----
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
    this.clearUserCache();
    this.router.navigate(['/login']);
  }
}
 