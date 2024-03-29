import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from '../../shared/ng-is-components/input.component';
import { ButtonComponent } from '../../shared/ng-is-components/button.component';
import { CommonModule } from '@angular/common';
import { AuthenticationAnimations } from './authentication.animations';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  UserGetResponse,
  UserLoginResponse,
  UserSignInRequest,
  UserSignUpRequest,
} from '../models/user.model';
import {
  EMPTY,
  Observable,
  catchError,
  combineLatest,
  of,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';
import { FormFieldComponent } from '../../shared/ng-is-components/form-field.component';
import { PopoverDirective } from '../../shared/ng-is-components/popover.directive';
import { Router } from '@angular/router';
import { ApplicationStateService } from '../../app-state.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    PopoverDirective,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
  animations: AuthenticationAnimations,
})
export class AuthenticationComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly appStateService: ApplicationStateService = inject(
    ApplicationStateService
  );
  // Form props
  signInForm?: FormGroup;
  signUpForm?: FormGroup;

  // Animation props
  bannerAnimationState: boolean = true;
  signInFormAnimationState: boolean = false;
  signUpFormAnimationState: boolean = true;

  ngOnInit(): void {
    this.initForms();
  }

  changeCurrentIndex(): void {
    this.bannerAnimationState = !this.bannerAnimationState;
    this.signInFormAnimationState = !this.signInFormAnimationState;
    this.signUpFormAnimationState = !this.signUpFormAnimationState;
    this.signInForm?.reset();
    this.signUpForm?.reset();
  }

  onSignUp(): void {
    if (!this.signUpForm) return;

    const body: UserSignUpRequest = {
      firstName: this.signUpForm.get('firstName')?.value,
      lastName: this.signUpForm.get('lastName')?.value,
      userName: this.signUpForm.get('userName')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
    };
    const method: string = 'signUp';
    const nextHandler: (resp: any) => void = () => {
      console.log('SIGN UP SUCCESS');
      this.changeCurrentIndex();
    };

    this.httpRequestHandler(method, body, nextHandler.bind(this));
  }

  onSignIn(): void {
    if (!this.signInForm) return;

    const body: UserSignInRequest = {
      userName: this.signInForm.get('userName')?.value,
      password: this.signInForm.get('password')?.value,
    };

    this.userService
      .signIn(body)
      .pipe(
        switchMap((resp: UserLoginResponse) => {
          localStorage.setItem('token', resp.token);
          return this.userService.get();
        }),
        catchError((err: any) => EMPTY),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((resp: UserGetResponse) => {
        this.appStateService.updateUser(resp);
        this.router.navigateByUrl('/home');
      });
  }

  private httpRequestHandler(
    method: string,
    body: any,
    nextHandler: (resp: any) => void
  ) {
    this.userService[method as keyof UserService](body)
      .pipe(
        catchError((err: any) => EMPTY),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((resp: any) => nextHandler(resp));
  }

  private initForms(): void {
    this.signInForm = this.fb.group({
      userName: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.signUpForm = this.fb.group({
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
