import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { tap, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export interface LoginResponse {
  token: string;
  public_id: string;
}

export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  public_id: string;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly api = environment.apiUrl;
  private currentUser: User | null = null;
  private userRequest$: Observable<User> | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // ---- Auth ----
  login(usernameOrEmail: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, {
      usernameOrEmail,
      password
    }).pipe(
      tap(res => {
        if (res?.token) {
          this.setToken(res.token);
          this.clearUserCache();
        }
      })
    );
  }

  signup(data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return this.http.post(`${this.api}/users`, {
      user: {
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password
      }
    });
  }

  // ---- User ----
  getCurrentUser(): Observable<User> {
    if (this.currentUser) return of(this.currentUser);
    if (this.userRequest$) return this.userRequest$;

    this.userRequest$ = this.http.get<User>(`${this.api}/me`).pipe(
      tap(user => {
        this.currentUser = user;
        this.userRequest$ = null;
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

  isLoggedIn(): boolean {
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
