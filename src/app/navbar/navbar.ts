import { Component } from '@angular/core';
import { Authentication } from '../core/services/authentication.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {
  constructor(private authService: Authentication) {}

  logout() {
    this.authService.logout();
  }
}
