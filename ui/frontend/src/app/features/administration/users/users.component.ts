import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/ng-is-components/button.component';
import { IsTableComponent } from '../../../shared/ng-is-components/table.components';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IsTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {}
