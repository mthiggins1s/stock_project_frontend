import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthenticationService) {}

  onSubmit() {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Please enter your username/email and password.';
      return;
    }

    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        window.location.href = '/dashboard'; // redirect
      },
      error: () => {
        this.errorMessage = 'Invalid username/email or password.';
      }
    });
  }
}
