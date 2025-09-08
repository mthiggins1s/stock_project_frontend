import { Routes } from '@angular/router';

// lazy imports must return the correct component class
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(c => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup').then(c => c.SignupComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(c => c.DashboardComponent),
  },
  {
    path: 'portfolio',
    loadComponent: () =>
      import('./portfolio/portfolio').then(c => c.PortfolioComponent),
  },
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
