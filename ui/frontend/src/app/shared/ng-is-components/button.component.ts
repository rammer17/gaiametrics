import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'is-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [style]="style"
      [ngClass]="buttonClass()"
      (click)="onClick.emit($event)"
      (focus)="onFocus.emit($event)"
      (blur)="onBlur.emit($event)">
      <ng-container *ngIf="icon && !loading">
        <!-- <fa-icon
          [size]="iconSize"
          [pull]="iconPos"
          [style]="{ color: iconColor }"
          [icon]="['fas', icon]"></fa-icon> -->
        <i class="fa fa-solid fa-{{ icon }} me-2"></i>
      </ng-container>
      <ng-container *ngIf="loading === true">
        <!-- <fa-icon
          [size]="iconSize"
          [pull]="iconPos"
          animation="spin"
          [icon]="loadingIcon"></fa-icon> -->
        <i class="fa fa-circle-notch"></i>
      </ng-container>
      <ng-container *ngIf="label">
        {{ label }}
      </ng-container>
      <ng-content></ng-content>
    </button>
  `,
  styles: [
    `
      .is-button {
        padding: 0.75rem 1.25rem;
        border-radius: 0.5rem;
        border: none;
        transition: 0.2s;
        display: flex;
        align-items: center;
        min-height: 32px;
      }
      .is-button:hover:not([disabled]) {
        cursor: pointer;
      }

      .is-button-primary {
        color: var(--text-light);
        background-color: var(--primary-darker);
      }
      .is-button-primary:hover:not([disabled]) {
        background-color: var(--primary-darker);
      }
      .is-button-primary:enabled:focus {
        box-shadow: 0 0 0 2px var(--primary-darker);
      }

      .is-button-secondary {
        color: var(--text-light);
        background-color: var(--secondary);
      }
      .is-button-secondary:hover:not([disabled]) {
        background-color: var(--secondary);
      }
      .is-button-secondary:enabled:focus {
        box-shadow: 0 0 0 2px var(--secondary);
      }

      .is-button-destructive {
        color: var(--destructive-foreground);
        background-color: var(--destructive);
      }
      .is-button-destructive:hover:not([disabled]) {
        background-color: var(--destructive);
      }
      .is-button-destructive:enabled:focus {
        box-shadow: 0 0 0 2px var(--destructive);
      }

      .is-button-outlined {
        background-color: var(--background);
        border: 1px solid var(--border);
        color: var(--accent-foreground);
      }
      .is-button-outlined:hover:not([disabled]) {
        background-color: var(--accent);
      }

      .is-button-ghost {
        background-color: transparent;
        color: var(--foreground);
      }
      .is-button-ghost:hover:not([disabled]) {
        background-color: var(--muted);
      }

      .is-button-loading {
        opacity: 0.5;
      }

      .is-button-dashed {
        border: 1px dashed var(--border);
      }

      .spinner {
        animation: spin-animation 1s linear infinite;
        display: inline-block;
      }
      @keyframes spin-animation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input('type') type: string = 'button';
  @Input('label') label?: string;
  @Input('labelColor') labelColor?: string;
  @Input('icon') icon?: any;
  //TODO Add and sizes
  @Input('iconPos') iconPos: 'right' | 'left' = 'left';
  @Input('iconColor') iconColor?: string;
  @Input('iconSize') iconSize?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl';

  @Input('disabled') disabled?: boolean;
  @Input('loading') loading: boolean = false;
  @Input('styleClass') class: ButtonStyles[] = [];
  @Input('style') style: any;

  @Output('onClick') onClick: EventEmitter<MouseEvent> =
    new EventEmitter<MouseEvent>();
  @Output('onFocus') onFocus: EventEmitter<FocusEvent> =
    new EventEmitter<FocusEvent>();
  @Output('onBlur') onBlur: EventEmitter<FocusEvent> =
    new EventEmitter<FocusEvent>();

  //   loadingIcon: IconProp = faCircleNotch;

  buttonClass(): Object {
    return {
      'is-button': true,
      'is-button-primary': this.class.includes('primary'),
      'is-button-secondary': this.class.includes('secondary'),
      'is-button-destructive': this.class.includes('destructive'),
      'is-button-outlined': this.class.includes('outlined'),
      'is-button-ghost': this.class.includes('ghost'),
      'is-button-loading': this.loading,
      'is-button-dashed': this.class.includes('dashed'),
    };
  }
}

export type ButtonStyles =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outlined'
  | 'ghost'
  | 'dashed'
  | '';
