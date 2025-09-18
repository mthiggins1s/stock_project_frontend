import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  console.log('authGuard -- isLoggedIn:', loggedIn);

  if (loggedIn) {
    return true; // ✅ Allow navigation
  }

  // Return UrlTree instead of navigating manually
  authService.logout();
  return router.parseUrl('/login');
};
