import { CanActivateFn, Router } from '@angular/router';
import { Authentication } from '../services/authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Authentication)
  const router = inject(Router)

 if(authService.isLoggedIn()) {
  return true;
 } else {
  router.navigate(['/login'])
  return false;
 }
};
