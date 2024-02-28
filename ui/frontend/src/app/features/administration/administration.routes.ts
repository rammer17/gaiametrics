import { Route } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { IotDevicesComponent } from './iot-devices/iot-devices.component';
import { DeviceGroupsComponent } from './device-groups/device-groups.component';

export const ADMINISTRATION_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'plans',
    component: SubscriptionPlansComponent,
  },
  {
    path: 'devices',
    component: IotDevicesComponent,
  },
  {
    path: 'devicegroups',
    component: DeviceGroupsComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
