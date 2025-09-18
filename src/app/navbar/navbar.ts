import { Component, signal, effect } from '@angular/core';
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
export class NavbarComponent {
  menuOpen = signal(false);
  user = signal<User | null>(null);
  revealId = signal(false);

  constructor(private authService: AuthenticationService) {
    // Auto-sync user when service updates
    effect(() => {
      if (this.authService.isLoggedIn()) {
        if (!this.authService.getCachedUser()) {
          this.authService.getCurrentUser().subscribe({
            next: (u) => this.user.set(u),
            error: () => this.logout()
          });
        } else {
          this.user.set(this.authService.getCachedUser());
        }
      } else {
        this.user.set(null);
      }
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  toggleReveal(): void {
    this.revealId.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
    this.user.set(null);
  }

  copyPublicId(): void {
    const current = this.user();
    if (current?.public_id) {
      navigator.clipboard.writeText(current.public_id).then(() => {
        alert('✅ Public ID copied to clipboard!');
      });
    }
  }
}
