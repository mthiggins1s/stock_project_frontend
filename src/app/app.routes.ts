import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(c => c.Login)
  },
  {
    path: '',
    loadComponent: () => import('./stock-list/stock-list').then(c => c.StockListComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
