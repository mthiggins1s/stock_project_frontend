import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Authentication } from '../services/authentication.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(Authentication);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    router.navigate(['/'])
    return false;
  } else {
    return true
  }
};