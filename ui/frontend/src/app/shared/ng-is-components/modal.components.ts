import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrapFocusDirective } from './trap-focus.directive';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'is-modal',
  standalone: true,
  imports: [CommonModule, TrapFocusDirective],
  template: `
    <div class="modal-deadarea" trapFocus>
      <dialog
        style.width="{{ width }}px"
        [open]="isModalVisible"
        [@defaultAnimation]="isModalVisible"
        class="position-relative">
        <ng-container
          *ngTemplateOutlet="
            headerTemplate || defaultHeaderTemplate;
            context: { $implicit: context }
          "></ng-container>
        <ng-template #defaultHeaderTemplate>
          <h3 class="modal-heading">Are you sure?</h3>
        </ng-template>

        <ng-container
          *ngTemplateOutlet="
            contentTemplate || defaultContentTemplate;
            context: { $implicit: context }
          "></ng-container>
        <ng-template #defaultContentTemplate>
          <p class="content-paragraph">
            The phantom menace is the best episode! Also greedo shot first
          </p>
        </ng-template>

        <div class="modal-actions mt-3">
          <button class="cancel-btn" (click)="onCloseModal()">Cancel</button>
          <button class="submit-btn" (click)="save.emit()">Save</button>
        </div>
      </dialog>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        .modal-deadarea {
          background-color: rgba(0, 0, 0, 0.8);
          position: fixed;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          dialog {
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 0px solid #fefefe;
            overscroll-behavior: contain;
            .modal-heading {
              color: var(--text-dark);
              margin: 0 0 0.5rem 0;
            }
            .content-paragraph {
              color: var(--text-medium);
            }
            .modal-actions {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              gap: 0.5rem;
              .submit-btn,
              .cancel-btn {
                border: 1px solid;
                border-radius: 0.5rem;
                height: 2rem;
                white-space: nowrap;
                padding: 0.5rem 1rem;
                font-weight: 500;
                font-size: 0.875rem;
                line-height: 1.25rem;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                transition-property: color, background-color;
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                transition-duration: 0.15s;
              }
              .cancel-btn {
                border-color: var(--border-color);
                background-color: inherit;
                color: var(--text-dark);
              }
              .cancel-btn:hover {
                background-color: var(--primary-medium);
                color: var(--accent-foreground);
                cursor: pointer;
              }
              .submit-btn {
                border-color: var(--border-color);
                background-color: var(--primary-dark);
                color: var(--text-accent);
              }
              .submit-btn:hover {
                background-color: var(--text-accent);
                color: var(--text-light);
                cursor: pointer;
              }
            }
          }
        }
      }
    `,
  ],
  animations: [
    trigger('defaultAnimation', [
      state('void, false', style({ transform: 'scale(0)' })),
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(0.5)',
        }),
        animate(
          '150ms',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate('150ms', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class ModalComponent {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly renderer: Renderer2 = inject(Renderer2);

  @Input({ alias: 'header', required: true }) headerTemplate?: TemplateRef<any>;
  @Input({ alias: 'content', required: false }) contentTemplate: any;
  @Input({ alias: 'context', required: false }) context: any;
  @Input({ alias: 'open', required: true }) isModalVisible: boolean = false;
  @Input({ alias: 'width', required: true }) width: number = 600;

  @Output('close') close: EventEmitter<void> = new EventEmitter<void>();
  @Output('save') save: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.initEventListenerObservables();

    //prevent scrolling
    this.renderer.setStyle(
      document.querySelector('body'),
      'overflow',
      'hidden'
    );
  }

  ngOnDestroy(): void {
    //enable scrolling after modal is closed
    this.renderer.setStyle(document.querySelector('body'), 'overflow', 'auto');
  }

  onCloseModal(): void {
    this.close.emit();
  }

  private initEventListenerObservables(): void {
    fromEvent(window, 'wheel', { passive: false })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: any) => {
        if (e?.ctrlKey) e.preventDefault();
      });
  }
}
