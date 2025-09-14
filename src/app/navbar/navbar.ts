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
  revealId = false; // 👈 controls eye toggle

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.user = this.authService.getCachedUser();
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
        alert('Public ID copied to clipboard!');
      });
    }
  }
}
