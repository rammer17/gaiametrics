import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/ng-is-components/modal.components';
import { UserService } from '../../../../core/services/user.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserSignUpRequest } from '../../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormFieldComponent } from '../../../../shared/ng-is-components/form-field.component';

@Component({
  selector: 'app-users-add',
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
      <span class="fs-3">Add user</span>
    </ng-template>

    <ng-template #content>
      <form [formGroup]="form!">
        <app-form-field
          [formControlName]="'firstName'"
          [type]="'text'"
          [placeholder]="'First Name'"
          [icon]="'id-card'"></app-form-field>

        <app-form-field
          [formControlName]="'lastName'"
          [type]="'text'"
          [placeholder]="'Last Name'"
          [icon]="'address-card'"></app-form-field>

        <app-form-field
          [formControlName]="'userName'"
          [type]="'text'"
          [placeholder]="'Username'"
          [icon]="'user'"></app-form-field>

        <app-form-field
          [formControlName]="'password'"
          [type]="'password'"
          [placeholder]="'Password'"
          [icon]="'lock'"></app-form-field>

        <app-form-field
          [formControlName]="'email'"
          [type]="'email'"
          [placeholder]="'Email'"
          [icon]="'mailbox'"></app-form-field>
      </form>
    </ng-template>
  `,
})
export class UsersAddComponent {
  private readonly userService: UserService = inject(UserService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly fb: FormBuilder = inject(FormBuilder);

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {}

  onSave(): void {
    if (!this.form) return;

    const body: UserSignUpRequest = {
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      userName: this.form.get('userName')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    this.userService
      .signUp(body)
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
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      userName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$'
        ),
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }
}
