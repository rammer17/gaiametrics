import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserGetResponse } from './core/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApplicationStateService {
  private readonly router: Router = inject(Router);

  private readonly user$: BehaviorSubject<UserGetResponse | null> =
    new BehaviorSubject<UserGetResponse | null>(null);

  get user(): Observable<UserGetResponse | null> {
    return this.user$.asObservable();
  }

  updateUser(data: UserGetResponse): void {
    this.user$.next(data);
    this.router.navigateByUrl('/home');
  }

  signOut(): void {
    this.user$.next(null);
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }
}
