import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './core/menu/menu.component';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { ApplicationStateService } from './app-state.service';
import { EMPTY, Observable, catchError, take } from 'rxjs';
import { UserGetResponse } from './core/models/user.model';
import { UserService } from './core/services/user.service';
import { NgHttpLoaderComponent, NgHttpLoaderModule } from 'ng-http-loader';
import { SpinnerComponent } from './spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent,
    AuthenticationComponent,
    NgHttpLoaderModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly appStateService: ApplicationStateService = inject(
    ApplicationStateService
  );
  private readonly userService: UserService = inject(UserService);

  public spinnerComponent = SpinnerComponent;

  user$?: Observable<UserGetResponse | null>;

  ngOnInit(): void {
    this.user$ = this.appStateService.user;
    if (localStorage.getItem('token')) {
      this.userService
        .get()
        .pipe(
          catchError(() => {
            localStorage.removeItem('token');
            return EMPTY;
          }),
          take(1)
        )
        .subscribe((resp: UserGetResponse) =>
          this.appStateService.updateUser(resp)
        );
    }
  }
}
