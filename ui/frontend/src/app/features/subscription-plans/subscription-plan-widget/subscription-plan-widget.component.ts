import { Component, Input } from '@angular/core';
import { TooltipDirective } from '../../../shared/ng-is-components/tooltip.directive';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-subscription-plan-widget',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './subscription-plan-widget.component.html',
  styleUrl: './subscription-plan-widget.component.scss',
  animations: [
    trigger('defaultAnimation', [
      state('void, false', style({ transform: 'scale(0)' })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(30%) scale(0.5)',
        }),
        animate(
          '150ms',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class SubscriptionPlanWidgetComponent {
  @Input({ required: true, alias: 'plan' }) plan: any;
}
