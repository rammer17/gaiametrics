import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/ng-is-components/form-field.component';
import { ModalComponent } from '../../../../shared/ng-is-components/modal.components';
import { SubscriptionPlanService } from '../../../../core/services/subscription-plan.service';
import { SubscriptionPlanCreateRequest } from '../../../../core/models/subscription-plan.model';

@Component({
  selector: 'app-subscription-plans-add',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, FormFieldComponent],
  template: `
    <is-modal
      [open]="true"
      [header]="header"
      [content]="content"
      [width]="600"
      (close)="onClose()"
      (save)="onSave()"></is-modal>

    <ng-template #header>
      <span class="fs-3">Add subscription plan</span>
    </ng-template>

    <ng-template #content>
      <form [formGroup]="form!">
        <app-form-field
          [formControlName]="'title'"
          [type]="'text'"
          [placeholder]="'Title'"
          [icon]="'signature'"></app-form-field>
        <app-form-field
          [formControlName]="'price'"
          [type]="'number'"
          [placeholder]="'Price'"
          [icon]="'circle-dollar'"></app-form-field>
        <app-form-field
          [formControlName]="'subscriptionDurationDays'"
          [type]="'number'"
          [placeholder]="'Duration'"
          [icon]="'timer'"></app-form-field>
      </form>
    </ng-template>
  `,
})
export class SubscriptionPlansAddComponent {
  private readonly planService: SubscriptionPlanService = inject(
    SubscriptionPlanService
  );
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: SubscriptionPlanCreateRequest = {
      title: this.form.get('title')?.value,
      price: this.form.get('price')?.value,
      subscriptionDurationDays: this.form.get('subscriptionDurationDays')
        ?.value,
    };

    this.planService
      .create(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        //TODO Add toast
        this.onClose();
      });
  }

  onClose(): void {
    this.close.emit();
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      subscriptionDurationDays: this.fb.control('', [Validators.required]),
    });
  }
}
