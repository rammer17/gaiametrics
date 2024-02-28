import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container
      *ngIf="
        controlGroup[controlName]?.invalid &&
        (controlGroup[controlName]?.dirty || controlGroup[controlName]?.touched)
      ">
      <div class="position-relative">
        <ng-container *ngIf="controlGroup[controlName]?.errors?.required">
          <div
            style="color: var(--destructive); border: 1px solid var(--destructive); top: 8px "
            class="form-error position-absolute rounded w-100 px-3 py-2 ">
            <i
              style="color: var(--destructive)"
              class="fa-duotone fa-hexagon-exclamation"></i>
            Field is required
          </div>
          <div class="arrow"></div>
        </ng-container>

        <ng-container *ngIf="controlGroup[controlName]?.errors?.minlength">
          <div
            style="color: var(--destructive); border: 1px solid var(--destructive); top: 8px "
            class="form-error position-absolute rounded w-100 px-3 py-2 ">
            <i
              style="color: var(--destructive)"
              class="fa-duotone fa-hexagon-exclamation"></i>
            Too short
          </div>
          <div class="arrow"></div>
        </ng-container>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .form-error {
        background-color: rgb(254, 209, 209);
      }
      .arrow {
        position: absolute;
        z-index: 51;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid var(--destructive);
        left: calc(50% - 6px);
        top: 2px;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input({ alias: 'controlName', required: true }) controlName?: any;
  @Input({ alias: 'controlGroup', required: true }) controlGroup?: any;
}
