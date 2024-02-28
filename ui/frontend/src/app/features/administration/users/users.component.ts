import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/ng-is-components/button.component';
import { IsTableComponent } from '../../../shared/ng-is-components/table.components';
import { UserService } from '../../../core/services/user.service';
import { UserGetResponse } from '../../../core/models/user.model';
import { UsersAddComponent } from './users-add/users-add.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IsTableComponent, UsersAddComponent],
  template: `
    <div class="container-fluid">
      <div class="row p-0 m-0 user-select-none">
        <div class="col-3 text-dark fs-1">Users</div>
        <div class="col-10"></div>
      </div>

      <div class="row p-0 m-0">
        <div class="col-12 d-flex justify-content-between">
          <span class="user-select-none text-medium fs-6">
            Manage application users
          </span>

          <div class="mt-3">
            <is-button
              (onClick)="showAddModal = true"
              [type]="'button'"
              [label]="'Add user'"
              [styleClass]="['primary']"
              [icon]="'plus'"></is-button>
          </div>
        </div>
      </div>

      <div class="row p-0 m-0 mt-3">
        <div class="col-12">
          <ng-container *ngIf="users.length > 0">
            <is-table
              [data]="users"
              (action)="actionHandler($event)"></is-table>
            <app-users-add
              *ngIf="showAddModal"
              (close)="showAddModal = false; fetchUsers()"></app-users-add>
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
export class UsersComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly toastr: ToastrService = inject(ToastrService);

  users: UserGetResponse[] = [];
  showAddModal: boolean = false;

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAll().subscribe((resp: any) => this.users = resp);
  }

  actionHandler(action: { type: string; data: any }): void {
    if (action.type === 'DELETE') {
      this.toastr.error('Forbidden', 'User cannot be deleted!');
    }
  }
}
