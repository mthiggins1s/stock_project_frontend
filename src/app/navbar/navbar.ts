import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticationService, User } from '../core/services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  user: User | null = null;
  revealId = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    // ✅ Only check if logged in
    if (!this.authService.isLoggedIn()) {
      this.user = null;
      return;
    }

    // ✅ Pull from cache or fetch fresh
    this.user = this.authService.getCachedUser();
    if (!this.user) {
      this.authService.getCurrentUser().subscribe({
        next: (u: User) => (this.user = u),
        error: (err) => {
          console.warn('❌ Failed to load user (invalid/expired token):', err);
          this.logout(); // clear token + redirect
        }
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleReveal(): void {
    this.revealId = !this.revealId;
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
  }

  copyPublicId(): void {
    if (this.user?.public_id) {
      navigator.clipboard.writeText(this.user.public_id).then(() => {
        alert('✅ Public ID copied to clipboard!');
      });
    }
  }
}
