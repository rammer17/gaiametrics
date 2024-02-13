import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { IoTDeviceCreateRequest } from '../../../../core/models/iot-device.model';
import { IoTDeviceService } from '../../../../core/services/iot-device.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/ng-is-components/form-field.component';
import { ModalComponent } from '../../../../shared/ng-is-components/modal.components';

@Component({
  selector: 'app-iot-devices-add',
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
      //TODO ADD FORM
      </form>
    </ng-template>
  `,
})
export class IotDevicesAddComponent {
  private readonly planService: IoTDeviceService = inject(IoTDeviceService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: IoTDeviceCreateRequest = {
      name: this.form.get('name')?.value,
      latitude: this.form.get('latitude')?.value,
      longtitude: this.form.get('longtitude')?.value,
      deviceGroupId: this.form.get('deviceGroupId')?.value,
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
      latitude: this.fb.control('', [Validators.required]),
      longtitude: this.fb.control('', [Validators.required]),
      deviceGroupId: this.fb.control('', [Validators.required]),
    });
  }
}
