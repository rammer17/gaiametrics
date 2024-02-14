import { Component, inject } from "@angular/core";
import { IoTDeviceService } from "../../../core/services/iot-device.service";
import { IoTDeviceGetResponse } from "../../../core/models/iot-device.model";
import { IotDevicesAddComponent } from "./iot-devices-add/iot-devices-add.component";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../../../shared/ng-is-components/button.component";
import { IsTableComponent } from "../../../shared/ng-is-components/table.components";

@Component({
  selector: "app-iot-devices",
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IsTableComponent,
    IotDevicesAddComponent,
  ],
  template: `
    <div class="container-fluid">
      <div class="row p-0 m-0 user-select-none">
        <div class="col-3 text-dark fs-1">IoT Devices</div>
        <div class="col-10"></div>
      </div>

      <div class="row p-0 m-0">
        <div class="col-12 d-flex justify-content-between">
          <span class="user-select-none text-medium fs-6">
            Manage application IoT Devices
          </span>

          <div class="mt-3">
            <is-button
              (onClick)="showAddModal = true"
              [type]="'button'"
              [label]="'Add IoT Device'"
              [styleClass]="['primary']"
              [icon]="'plus'"></is-button>
          </div>
        </div>
      </div>

      <div class="row p-0 m-0 mt-3">
        <div class="col-12">
          <ng-container *ngIf="iotDevices?.length! > 0">
            <is-table [data]="iotDevices"></is-table>
            <app-iot-devices-add
              *ngIf="showAddModal"
              (close)="
                showAddModal = false; fetchDevices()
              "></app-iot-devices-add>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class IotDevicesComponent {
  private readonly iotService: IoTDeviceService = inject(IoTDeviceService);

  iotDevices: IoTDeviceGetResponse[] = [];
  showAddModal: boolean = false;

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.iotService.getAll().subscribe((resp: any) => (this.iotDevices = resp));
  }
}
