import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Please enter your username/email and password.';
      return;
    }

    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']); // ✅ Angular navigation
      },
      error: () => {
        this.errorMessage = 'Invalid username/email or password.';
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
