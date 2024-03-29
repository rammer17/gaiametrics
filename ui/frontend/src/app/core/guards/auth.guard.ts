import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardFn: CanActivateFn = () => {
  const router: Router = inject(Router);

  const token: string | null = localStorage.getItem('token');
  if (token) {
    return true;
  }

  return router.createUrlTree(['/auth']);
};
