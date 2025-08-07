import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Authentication } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    password_confirmation: new FormControl('')
  })

  errors:string[] = []

  constructor(private authService: Authentication, private router:Router) {  }

  onSignup() {
    const formValue = this.signupForm.value
    this.authService.signup({user: formValue}).subscribe({
      next: (res:any) => {
        this.router.navigate(['/login'])
      },
      error: (error:any) => {
        console.log(error.error)
        this.errors = error.error
      }
    })
  }
}
