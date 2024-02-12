import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/ng-is-components/button.component';
import { IsTableComponent } from '../../../shared/ng-is-components/table.components';
import { UserService } from '../../../core/services/user.service';
import { UserGetResponse } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IsTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly userService: UserService = inject(UserService);

  users: UserGetResponse[] = [];

  ngOnInit(): void {
    console.log(this.userService);
    this.userService.getAll().subscribe((resp: any) => (this.users = resp));
  }
}
