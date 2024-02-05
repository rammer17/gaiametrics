import { Routes } from '@angular/router';
import { HomeComponent } from './core/layout/home/home.component';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { GlobalMapComponent } from './features/global-map/global-map.component';

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
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
