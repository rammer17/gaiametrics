import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopoverDirective } from '../../shared/ng-is-components/popover.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, PopoverDirective, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  showAccountPopover: boolean = false;
  menuList: any[] = [
    {
      label: 'Global Map',
      icon: 'earth-europe',
      routerLink: 'map',
    },
    {
      label: 'Subscription plans',
      icon: 'wallet',
      routerLink: 'plans',
    },
  ];
}
