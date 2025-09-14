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

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    // ✅ First try cached user (instant load)
    this.user = this.authService.getCachedUser();

    // ✅ Always attempt to fetch from API once if cache is empty
    if (!this.user) {
      this.authService.getCurrentUser().subscribe({
        next: (u: User) => (this.user = u),
        error: (err: unknown) =>
          console.error('Failed to load current user:', err)
      });
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.user = null; // ✅ clear navbar immediately
  }

  copyPublicId(): void {
    if (this.user?.public_id) {
      navigator.clipboard.writeText(this.user.public_id).then(() => {
        alert('Public ID copied to clipboard!');
      });
    }
  }
}
