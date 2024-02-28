import { Component, inject } from '@angular/core';
import { DeviceGroupService } from '../../../core/services/device.group.service';
import { DeviceGroupGetResponse } from '../../../core/models/device-group.model';
import { DeviceGroupsAddComponent } from './device-groups-add/device-groups-add.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ng-is-components/button.component';
import { IsTableComponent } from '../../../shared/ng-is-components/table.components';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-device-groups',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    IsTableComponent,
    DeviceGroupsAddComponent,
  ],
  template: `
    <div class="container-fluid">
      <div class="row p-0 m-0 user-select-none">
        <div class="col-3 text-dark fs-1">Device Group</div>
        <div class="col-10"></div>
      </div>

      <div class="row p-0 m-0">
        <div class="col-12 d-flex justify-content-between">
          <span class="user-select-none text-medium fs-6">
            Manage application Device Groups
          </span>

          <div class="mt-3">
            <is-button
              (onClick)="showAddModal = true"
              [type]="'button'"
              [label]="'Add Device Group'"
              [styleClass]="['primary']"
              [icon]="'plus'"></is-button>
          </div>
        </div>
      </div>

      <div class="row p-0 m-0 mt-3">
        <div class="col-12">
          <ng-container *ngIf="deviceGroups?.length! > 0">
            <is-table
              [data]="deviceGroups"
              (action)="actionHandler($event)"></is-table>
            <app-device-groups-add
              *ngIf="showAddModal"
              (close)="
                showAddModal = false; fetchDeviceGroups()
              "></app-device-groups-add>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class DeviceGroupsComponent {
  private readonly deviceGroupService: DeviceGroupService =
    inject(DeviceGroupService);
  private readonly toastr: ToastrService = inject(ToastrService);

  deviceGroups: DeviceGroupGetResponse[] = [];
  showAddModal: boolean = false;

  ngOnInit(): void {
    this.fetchDeviceGroups();
  }

  fetchDeviceGroups(): void {
    this.deviceGroupService
      .getAll()
      .subscribe((resp: any) => (this.deviceGroups = resp));
  }

  actionHandler(action: { type: string; data: any }): void {
    if (action.type === 'DELETE') {
      this.deviceGroupService
        .delete(action.data.id)
        .pipe(take(1))
        .subscribe(() => {
          this.toastr.success('Success', 'Device group was deleted!');
          this.fetchDeviceGroups();
        });
    }
  }
}
