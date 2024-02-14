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
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';
import { IoTDeviceService } from '../../../../core/services/iot-device.service';
import { UserService } from '../../../../core/services/user.service';
import { IoTDeviceGetResponse } from '../../../../core/models/iot-device.model';
import { UserGetResponse } from '../../../../core/models/user.model';
import { FormDropdownComponent } from '../../../../shared/ng-is-components/form-dropdown.components';
import { FormMultiselectComponent } from '../../../../shared/ng-is-components/form-multiselect.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-device-groups-add',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    FormFieldComponent,
    NgIf,
    AsyncPipe,
    FormMultiselectComponent,
  ],
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
          [formControlName]="'name'"
          [type]="'text'"
          [placeholder]="'Name'"
          [icon]="'signature'"></app-form-field>

        <ng-container *ngIf="vm$ | async as vm">
          <app-form-multiselect
            [formControlName]="'deviceIds'"
            [data]="vm.devices"
            [placeholder]="'Devices'"></app-form-multiselect>

          <app-form-multiselect
            [formControlName]="'userIds'"
            [data]="vm.users"
            [placeholder]="'Users'"></app-form-multiselect>
        </ng-container>
      </form>
    </ng-template>
  `,
})
export class DeviceGroupsAddComponent {
  private readonly planService: DeviceGroupService = inject(DeviceGroupService);
  private readonly deviceService: IoTDeviceService = inject(IoTDeviceService);
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastr: ToastrService = inject(ToastrService);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  vm$?: Observable<any>;

  form?: FormGroup;

  ngOnInit(): void {
    this.initViewModel();
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: DeviceGroupCreateRequest = {
      name: this.form.get('name')?.value,
      deviceIds: this.form.get('deviceIds')?.value.map((x: any) => x.value),
      userIds: this.form.get('userIds')?.value.map((x: any) => x.value),
    };

    console.log(body);
    this.planService
      .create(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastr.success('Success', 'Device Group added successfully');
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

  private initViewModel(): void {
    this.vm$ = combineLatest({
      devices: this.deviceService.getAllNoLoader().pipe(
        map((x: IoTDeviceGetResponse[]) => {
          const y = x.map((x) => {
            return {
              name: x.name,
              value: x.id,
            };
          });
          return y;
        })
      ),
      users: this.userService.getAllNoLoader().pipe(
        map((x: UserGetResponse[]) => {
          const y = x.map((x) => {
            return {
              name: x.username,
              value: x.id,
            };
          });
          return y;
        })
      ),
    }).pipe(takeUntilDestroyed(this.destroyRef));
  }
}
