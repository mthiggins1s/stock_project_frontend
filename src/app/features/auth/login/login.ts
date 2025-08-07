import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Authentication } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  isError:boolean = false;

  constructor(private authService:Authentication, private router:Router) {  }

  login() {
    if(this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.authService.login(username, password).subscribe({
        next: (res:any) => {
          console.log(res);
          this.authService.setToken(res.token)
          this.router.navigate(['/'])
        },
        error: (error:any) => {
          console.log("Error when logging", error)
          this.isError = true
        }
      });
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
