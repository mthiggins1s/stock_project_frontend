import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login),
    canActivate: [noAuthGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./stock-list/stock-list').then(c => c.StockListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./portfolio/portfolio').then(c => c.PortfolioComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
