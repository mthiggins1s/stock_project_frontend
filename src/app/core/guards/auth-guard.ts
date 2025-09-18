import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  console.log('authGuard -- isLoggedIn:', loggedIn);

  if (loggedIn) {
    return true; // ✅ allow navigation
  }

  // logout and redirect if not logged in
  authService.logout();
  return router.parseUrl('/login');
};
