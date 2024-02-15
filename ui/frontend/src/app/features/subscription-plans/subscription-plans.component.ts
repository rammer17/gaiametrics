import { Component } from '@angular/core';
import { SubscriptionPlanWidgetComponent } from './subscription-plan-widget/subscription-plan-widget.component';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [SubscriptionPlanWidgetComponent],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.scss'
})
export class SubscriptionPlansComponent {

}
