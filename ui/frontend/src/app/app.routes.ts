import { Routes } from '@angular/router';
import { HomeComponent } from './core/layout/home/home.component';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { GlobalMapComponent } from './features/analytics/global-map/global-map.component';
import { authGuardFn } from './core/guards/auth.guard';
import { administrationGuardFn } from './core/guards/administration.guard';
import { SubscriptionPlansComponent } from './features/subscription-plans/subscription-plans.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    component: AuthenticationComponent,
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('./features/analytics/analytics.routes').then(
        (m) => m.ANALYTICS_ROUTES
      ),
    canMatch: [authGuardFn],
    canActivateChild: [authGuardFn]
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./features/administration/administration.routes').then(
        (m) => m.ADMINISTRATION_ROUTES
      ),
    canMatch: [administrationGuardFn],
  },
  {
    path: 'pricing',
    component: SubscriptionPlansComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
