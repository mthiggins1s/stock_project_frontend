import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const noAuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  console.log('noAuthGuard -- isLoggedIn:', loggedIn);

  if (loggedIn) {
    // ✅ redirect away from login/signup if already logged in
    return router.parseUrl('/dashboard');
  }

  return true; // ✅ allow access
};
