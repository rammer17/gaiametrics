import { Component } from '@angular/core';
import { SubscriptionPlanWidgetComponent } from './subscription-plan-widget/subscription-plan-widget.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [SubscriptionPlanWidgetComponent, NgFor],
  templateUrl: './subscription-plans.component.html',
  styleUrl: './subscription-plans.component.scss',
})
export class SubscriptionPlansComponent {
  plans: any[] = [];

  ngOnInit(): void {
    this.initPlans();
  }

  private initPlans(): void {
    this.plans = [
      {
        name: 'Free',
        recommended: false,
        price: '0$',
        payments: 'free forever',
        benefits: [
          {
            label: 'Limited access',
            granted: true,
          },
          {
            label: '10 readings/day',
            granted: true,
          },
          {
            label: 'Predefined device types',
            granted: true,
          },
          {
            label: 'Private groups',
            granted: false,
          },
          {
            label: 'Statistics',
            granted: false,
          },
        ],
      },
      {
        name: 'Premium',
        recommended: true,
        price: '10$',
        payments: 'monthly payment',
        benefits: [
          {
            label: 'Unlimited access',
            granted: true,
          },
          {
            label: '1000 readings/day',
            granted: true,
          },
          {
            label: 'Predefined device types',
            granted: true,
          },
          {
            label: 'Private groups',
            granted: true,
          },
          {
            label: 'Statistics',
            granted: true,
          },
        ],
      },
      {
        name: 'Custom',
        recommended: false,
        price: 'Get a quote',
        // payments: 'monthly payment',
        benefits: [
          {
            label: 'Unlimited access',
            granted: true,
          },
          {
            label: 'Unlimited readings',
            granted: true,
          },
          {
            label: 'Custom device types',
            granted: true,
          },
          {
            label: 'Private groups',
            granted: true,
          },
          {
            label: 'Statistics',
            granted: true,
          },
        ],
      },
    ];
  }
}
