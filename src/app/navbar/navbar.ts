import { Component } from '@angular/core';
import { Authentication } from '../core/services/authentication.service'; // Adjust the path as needed

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true
})
export class NavbarComponent {
  constructor(private authService: Authentication) {}

  logout() {
    this.authService.logout();
  }
}
