import { Routes } from '@angular/router';
import { HomeComponent } from './core/layout/home/home.component';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { GlobalMapComponent } from './features/global-map/global-map.component';
import { authGuardFn } from './core/guards/auth.guard';
import { administrationGuardFn } from './core/guards/administration.guard';

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
    path: 'map',
    component: GlobalMapComponent,
    canActivate: [authGuardFn],
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./features/administration/administration.routes').then(
        (m) => m.ADMINISTRATION_ROUTES
      ),
    // canMatch: [administrationGuardFn],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
