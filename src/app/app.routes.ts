import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  // --- Auth ---
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(c => c.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup').then(c => c.SignupComponent),
    canActivate: [noAuthGuard],
  },

  // --- Protected ---
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(c => c.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./portfolio/portfolio').then(c => c.PortfolioComponent),
    canActivate: [authGuard],
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search/search').then(c => c.SearchComponent),
    canActivate: [authGuard],
  },
  {
    path: 'portfolio-search',
    loadComponent: () =>
      import('./features/portfolio-search/portfolio-search').then(
        c => c.PortfolioSearchComponent
      ),
    canActivate: [authGuard],
  },

  // --- Redirects ---
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
