import { Component, inject } from '@angular/core';
import { RoleService } from '../../../core/services/role.service';
import { RoleGetResponse } from '../../../core/models/role.model';
import { RolesAddComponent } from './roles-add/roles-add.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/ng-is-components/button.component';
import { IsTableComponent } from '../../../shared/ng-is-components/table.components';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IsTableComponent, RolesAddComponent],
  template: `
    <div class="container-fluid">
      <div class="row p-0 m-0 user-select-none">
        <div class="col-3 text-dark fs-1">Roles</div>
        <div class="col-10"></div>
      </div>

      <div class="row p-0 m-0">
        <div class="col-12 d-flex justify-content-between">
          <span class="user-select-none text-medium fs-6">
            Manage application roles
          </span>

          <div class="mt-3">
            <is-button
              (onClick)="showAddModal = true"
              [type]="'button'"
              [label]="'Add role'"
              [styleClass]="['primary']"
              [icon]="'plus'"></is-button>
          </div>
        </div>
      </div>

      <div class="row p-0 m-0 mt-3">
        <div class="col-12">
          <ng-container *ngIf="roles.length > 0">
            <is-table [data]="roles"></is-table>
            <app-roles-add
              *ngIf="showAddModal"
              (close)="showAddModal = false"></app-roles-add>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class RolesComponent {
  private readonly roleService: RoleService = inject(RoleService);

  roles: RoleGetResponse[] = [];
  showAddModal: boolean = false;

  ngOnInit(): void {
    this.roleService.getAll().subscribe((resp: any) => (this.roles = resp));
  }
}
