import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/ng-is-components/form-field.component';
import { ModalComponent } from '../../../../shared/ng-is-components/modal.components';
import { RoleService } from '../../../../core/services/role.service';
import { RoleCreateRequest } from '../../../../core/models/role.model';

@Component({
  selector: 'app-roles-add',
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
      <span class="fs-3">Add role</span>
    </ng-template>

    <ng-template #content>
      <form [formGroup]="form!">
        <app-form-field
          [formControlName]="'id'"
          [type]="'number'"
          [placeholder]="'Id'"
          [icon]="'id-badge'"></app-form-field>
        <app-form-field
          [formControlName]="'name'"
          [type]="'text'"
          [placeholder]="'Name'"
          [icon]="'signature'"></app-form-field>
        <app-form-field
          [formControlName]="'claims'"
          [type]="'text'"
          [placeholder]="'Claims'"
          [icon]="'clipboard-list'"></app-form-field>
      </form>
    </ng-template>
  `,
})
export class RolesAddComponent {
  private readonly roleService: RoleService = inject(RoleService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  onSave(): void {
    if (!this.form) return;

    const body: RoleCreateRequest = {
      id: this.form.get('id')?.value,
      name: this.form.get('name')?.value,
      claims: this.form.get('claims')?.value,
    };

    this.roleService
      .createRole(body)
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
      id: this.fb.control('', [Validators.required]),
      name: this.fb.control('', [Validators.required]),
      claims: this.fb.control('', [Validators.required]),
    });
  }
}
