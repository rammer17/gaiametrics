import { HostListener, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly menuMinWidth: number = 300;
  private readonly menuMaxWidth: number = 0.2 * window.innerWidth;
  private isCollapsed: boolean = false;
  private isCollapsed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isMenuCollapsed(): Observable<boolean> {
    return this.isCollapsed$.asObservable();
  }

  get menuWidth(): number {
    return parseInt(
      getComputedStyle(document.body).getPropertyValue('--menu-width'),
      10
    );
  }

  setMenuWidth(width: number): void {
    if (width < 110) {
      document.body.style.setProperty('--menu-width', `${110}px`);
      this.isCollapsed = true;
      this.isCollapsed$.next(true);
      return;
    }

    if (width >= this.menuMinWidth && this.isCollapsed) {
      document.body.style.setProperty('--menu-width', `${this.menuMinWidth}px`);
      this.isCollapsed = false;
      this.isCollapsed$.next(false);
      return;
    }

    if (width >= this.menuMinWidth && !this.isCollapsed) {
      const clampedWidth = Math.min(
        Math.max(width, this.menuMinWidth),
        this.menuMaxWidth
      );
      document.body.style.setProperty('--menu-width', `${clampedWidth}px`);
      this.isCollapsed = false;
      this.isCollapsed$.next(false);
    }
  }
}
