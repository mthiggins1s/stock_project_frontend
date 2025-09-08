import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  signup() {
    this.http
      .post('http://localhost:3000/users', {
        user: { name: this.name, email: this.email, password: this.password }
      })
      .subscribe({
        next: () => {
          window.location.href = '/login';
        },
        error: () => {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      });
  }
}
