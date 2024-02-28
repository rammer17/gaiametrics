import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from "@angular/core";
import { IoTDeviceCreateRequest } from "../../../../core/models/iot-device.model";
import { IoTDeviceService } from "../../../../core/services/iot-device.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormFieldComponent } from "../../../../shared/ng-is-components/form-field.component";
import { ModalComponent } from "../../../../shared/ng-is-components/modal.components";
import { DeviceGroupService } from "../../../../core/services/device.group.service";
import { DeviceGroupGetResponse } from "../../../../core/models/device-group.model";
import { Observable, combineLatest, map } from "rxjs";
import { FormDropdownComponent } from "../../../../shared/ng-is-components/form-dropdown.components";
import { AsyncPipe, NgIf } from "@angular/common";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-iot-devices-add",
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    FormFieldComponent,
    FormDropdownComponent,
    NgIf,
    AsyncPipe,
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

        <app-form-field
          [formControlName]="'latitude'"
          [type]="'number'"
          [placeholder]="'Latitude'"
          [icon]="'globe'"></app-form-field>

        <app-form-field
          [formControlName]="'longtitude'"
          [type]="'number'"
          [placeholder]="'Longtitude'"
          [icon]="'globe'"></app-form-field>

        <ng-container *ngIf="vm$ | async as vm">
          <app-form-dropdown
            [formControlName]="'deviceGroupId'"
            [data]="vm.deviceGroups"
            [placeholder]="'DeviceGroup'"></app-form-dropdown>
        </ng-container>
      </form>
    </ng-template>
  `,
})
export class IotDevicesAddComponent {
  private readonly iotDeviceService: IoTDeviceService =
    inject(IoTDeviceService);
  private readonly deviceGroupService: DeviceGroupService =
    inject(DeviceGroupService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly toastr: ToastrService = inject(ToastrService);

  @Output("close") close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  vm$?: Observable<{ deviceGroups: any[] }>;

  ngOnInit(): void {
    this.initViewModel();
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: IoTDeviceCreateRequest = {
      name: this.form.get("name")?.value,
      latitude: +this.form.get("latitude")?.value,
      longtitude: +this.form.get("longtitude")?.value,
      deviceGroupId: this.form.get("deviceGroupId")?.value.value,
    };

    this.iotDeviceService
      .create(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.toastr.success("Success", "IoT Device added successfully");
        this.onClose();
      });
  }

  onClose(): void {
    this.close.emit();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: this.fb.control("", [Validators.required]),
      latitude: this.fb.control("", [Validators.required]),
      longtitude: this.fb.control("", [Validators.required]),
      deviceGroupId: this.fb.control("", [Validators.required]),
    });
  }

  private initViewModel(): void {
    this.vm$ = combineLatest({
      deviceGroups: this.deviceGroupService.getAllNoLoader().pipe(
        map((x: DeviceGroupGetResponse[]) => {
          const y = x.map((x) => {
            return {
              name: x.name,
              value: x.id,
            };
          });
          return y;
        })
      ),
    }).pipe(takeUntilDestroyed(this.destroyRef));
  }
}
