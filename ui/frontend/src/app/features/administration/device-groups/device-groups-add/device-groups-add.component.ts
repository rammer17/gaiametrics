import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { DeviceGroupService } from '../../../../core/services/device.group.service';
import { DeviceGroupCreateRequest } from '../../../../core/models/device-group.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/ng-is-components/form-field.component';
import { ModalComponent } from '../../../../shared/ng-is-components/modal.components';

@Component({
  selector: 'app-device-groups-add',
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
      <form [formGroup]="form!">//TODO ADD FORM</form>
    </ng-template>
  `,
})
export class DeviceGroupsAddComponent {
  private readonly planService: DeviceGroupService = inject(DeviceGroupService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: DeviceGroupCreateRequest = {
      name: this.form.get('name')?.value,
      deviceIds: this.form.get('deviceIds')?.value,
      userIds: this.form.get('longtitude')?.value,
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
      name: this.fb.control('', [Validators.required]),
      deviceIds: this.fb.control('', [Validators.required]),
      userIds: this.fb.control('', [Validators.required]),
    });
  }
}
