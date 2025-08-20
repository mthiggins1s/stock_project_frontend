import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  // NOTE: Angular uses `styleUrls` (array). If you used `styleUrl`, styles may not load.
  styleUrls: ['./login.css'],
})
export class Login {
  // Strongly typed + non-nullable controls to avoid undefined reads
  loginForm = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  isError = false;
  isLoading = false;
  errorMessage = '';

  constructor(private auth: Authentication, private router: Router) {}

  login() {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isError = false;
    this.errorMessage = '';
    this.isLoading = true;

    const { username, password } = this.loginForm.getRawValue();

    this.auth.login(username, password).subscribe({
      next: () => {
        // token is already saved by the service's tap()
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        // 401 from Rails => unauthorized; other statuses bubble up too
        this.isError = true;
        this.errorMessage =
          err?.error?.error || // { error: "unauthorized" } or "token expired"
          err?.error?.messages?.[0] || // in case backend sends messages array
          'Invalid username or password';
        console.error('Error when logging', err);
      },
      complete: () => (this.isLoading = false),
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
