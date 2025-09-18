import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const noAuthGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  console.log('noAuthGuard -- isLoggedIn:', loggedIn);

  if (loggedIn) {
    // Redirect logged-in users away from login/signup pages
    return router.parseUrl('/dashboard');
  }

  return true; // ✅ Allow access to login/signup
};
