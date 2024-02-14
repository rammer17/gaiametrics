import { Component, inject } from "@angular/core";
import { SubscriptionPlansAddComponent } from "./subscription-plans-add/subscription-plans-add.component";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../shared/ng-is-components/button.component";
import { IsTableComponent } from "../../../shared/ng-is-components/table.components";
import { SubscriptionPlanGetAllResponse } from "../../../core/models/subscription-plan.model";
import { SubscriptionPlanService } from "../../../core/services/subscription-plan.service";

@Component({
  selector: "app-subscription-plans",
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IsTableComponent,
    SubscriptionPlansAddComponent,
  ],
  template: `
    <div class="container-fluid">
      <div class="row p-0 m-0 user-select-none">
        <div class="col-3 text-dark fs-1">Subscription plans</div>
        <div class="col-10"></div>
      </div>

      <div class="row p-0 m-0">
        <div class="col-12 d-flex justify-content-between">
          <span class="user-select-none text-medium fs-6">
            Manage application subscription plans
          </span>

          <div class="mt-3">
            <is-button
              (onClick)="showAddModal = true"
              [type]="'button'"
              [label]="'Add subscription plan'"
              [styleClass]="['primary']"
              [icon]="'plus'"></is-button>
          </div>
        </div>
      </div>

      <div class="row p-0 m-0 mt-3">
        <div class="col-12">
          <ng-container *ngIf="subscriptionPlans?.length! > 0">
            <is-table [data]="subscriptionPlans"></is-table>
            <app-subscription-plans-add
              *ngIf="showAddModal"
              (close)="
                showAddModal = false; fetchPlans()
              "></app-subscription-plans-add>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class SubscriptionPlansComponent {
  private readonly planService: SubscriptionPlanService = inject(
    SubscriptionPlanService
  );

  subscriptionPlans: SubscriptionPlanGetAllResponse[] = [];
  showAddModal: boolean = false;

  ngOnInit(): void {
    this.fetchPlans();
  }

  fetchPlans(): void {
    this.planService
      .getAll()
      .subscribe((resp: any) => (this.subscriptionPlans = resp));
  }
}
