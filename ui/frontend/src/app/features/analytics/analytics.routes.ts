import { Route } from '@angular/router';
import { GlobalMapComponent } from './global-map/global-map.component';

export const ANALYTICS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: 'map',
    component: GlobalMapComponent,
  },
  {
    path: '**',
    redirectTo: 'map',
    pathMatch: 'full',
  },
];
