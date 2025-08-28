import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  // --- Auth ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login),
    canActivate: [noAuthGuard]
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup').then(c => c.Signup),
    canActivate: [noAuthGuard]
  },

  // --- Dashboard (new default) ---
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/dashboard/dashboard').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },

  // --- Stocks List ---
  {
    path: 'stocks',
    loadComponent: () => import('./stock-list/stock-list').then(c => c.StockListComponent),
    canActivate: [authGuard]
  },

  // --- Portfolio ---
  {
    path: 'portfolio',
    loadComponent: () => import('./portfolio/portfolio').then(c => c.PortfolioComponent),
    canActivate: [authGuard]
  },

  // --- Portfolio Search (NEW) ---
  {
    path: 'portfolio-search',
    loadComponent: () => import('./features/portfolio-search/portfolio-search')
      .then(c => c.PortfolioSearchComponent),
    canActivate: [authGuard]
  },

  // --- Wildcard (redirect) ---
  {
    path: '**',
    redirectTo: 'login'
  }
];
