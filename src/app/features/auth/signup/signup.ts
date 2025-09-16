import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup(): void {
    this.http.post('http://localhost:3000/users', {
      user: {
        username: this.username,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password
      }
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error('Signup failed:', err);
        this.errorMessage = 'Signup failed. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
