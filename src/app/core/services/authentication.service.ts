import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  
  constructor(private http:HttpClient, private router:Router ) {  }

  login(username: string, password: string) {
  return this.http.post<{ token: string }>(
    `${environment.apiUrl}/login`,
    { username, password }
    );
  }

  signup(data:any){
    return this.http.post(`${environment.apiUrl}/users`, data)
  }

  setToken(token: string){
    localStorage.setItem('token', token)
  }

  getToken(){
    return localStorage.getItem('token')
  }
  
  isLoggedIn(){
    // if the value is returned as null, then the !! will turn the null into FALSE, if it returns a string, itll return TRUE
    return !!this.getToken();
  }

  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}