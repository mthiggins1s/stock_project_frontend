import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const loggedIn = authService.isLoggedIn();
  console.log('authGuard -- isLoggedIn:', loggedIn);

  if (loggedIn) {
    return true;
  }

  // ✅ Clear stale tokens before redirect
  authService.logout();
  router.navigate(['/login']);
  return false;
};
