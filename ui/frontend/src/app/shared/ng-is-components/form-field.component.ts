import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControlDirective,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from './form-error.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, FormErrorComponent],
  template: `
    <div class="form-field-group mt-4">
      <div class="w-100 mb-2">{{ placeholder }}</div>
      <div [ngClass]="wrapperClass()">
        <input
          autocomplete="off"
          #input
          id="input"
          [disabled]="disabled"
          [type]="type"
          [placeholder]="placeholder"
          title=""
          [ngModel]="value"
          (ngModelChange)="onInputChange($event)"
          [accept]="allowedExtensions"
          class="form-input" />
        <i
          *ngIf="inputIcon"
          [style]="{ color: iconColor }"
          [ngClass]="iconClass()"
          class="fa fa-solid fa-{{ inputIcon }} fa-{{ iconSize }}"></i>
      </div>
      <app-form-error
        *ngIf="!noError"
        [controlGroup]="hostFormGroup!.control!.controls"
        [controlName]="formControlName"></app-form-error>
    </div>
  `,
  styles: [
    `
      * {
        box-sizing: border-box;
      }
      .form-input {
        padding: 0.5rem 0.75rem;
        border-radius: calc(0.5rem - 2px);
        height: 2rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        border: 1px solid var(--border-color);
        background-color: var(--primary-light);
        color: var(--text-dark);
        position: relative;
        z-index: 51;
        transition: 0.15s border;
      }
      .form-input:disabled:hover {
        cursor: not-allowed;
      }
      input:focus-visible {
        box-shadow: var(--primary-light);
        outline: 2px solid var(--text-dark);
        outline-offset: 1px;
      }
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type='number'] {
        -moz-appearance: textfield;
        appearance: textfield;
      }
      .input-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column !important;
      }
      .input-wrapper:focus-within {
        .form-input::placeholder {
          opacity: 0;
        }
      }
      .input-destructive {
        .form-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
          outline: 2px solid var(--destructive);
        }
      }
      .input-success {
        .form-input {
          transition: 0.15s;
          box-shadow: var(--primary-light);
          outline: 2px solid var(--success);
        }
      }
      .input-ghost {
        .form-input {
          outline: none;
          border: none;
        }
      }

      .form-input::file-selector-button {
        background: var(--primary-light);
        color: var(--text-dark);
        outline: none;
        border: none;
      }
      .input-file-icon {
        .form-input::file-selector-button {
          margin-left: 20px;
        }
      }
      .input-icon {
        input {
          padding-left: 2rem;
        }
      }
      .form-input::file-selector-button:hover,
      input[type='file']:hover {
        cursor: pointer;
      }
      i.fa {
        color: var(--text-dark);
        position: absolute;
        z-index: 51;
        transform: translateX(50%);
      }
      .form-input-icon-right {
        right: 0;
        transform: translateX(-50%);
      }
    `,
  ],
  //   changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input({ alias: 'formControlName', required: true }) formControlName: any;
  @Input({ alias: 'noError', required: false }) noError: boolean = false;
  @Input({ alias: 'type', required: true }) type: InputTypes = 'text';
  @Input({ alias: 'placeholder', required: true }) placeholder: string = '';
  @Input({ alias: 'disabled', required: false }) disabled: boolean = false;
  @Input({ alias: 'allowedExtensions', required: false })
  allowedExtensions: string[] = [];
  @Input({ alias: 'icon', required: true }) inputIcon?: any;
  @Input({ alias: 'iconPos', required: false }) iconPos: 'left' | 'right' =
    'left';
  @Input('iconColor') iconColor?: string;
  @Input('iconSize') iconSize?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl';
  @Input('ghost') ghost: boolean = false;

  value: any;

  readonly hostFormGroup: FormGroupDirective = inject(FormGroupDirective);

  ngOnInit(): void {
    // console.log(this.hostFormGroup.control);
    // console.log(this.formControlName);
    // console.log(this.hostFormGroup?.control?.controls[this.formControlName]);
  }

  wrapperClass(): Object {
    return {
      'input-wrapper': true,
      'input-destructive':
        this.hostFormGroup?.control?.controls[this.formControlName]?.invalid &&
        this.hostFormGroup?.control?.controls[this.formControlName]?.touched &&
        !this.noError,
      'input-success':
        this.hostFormGroup?.control?.controls[this.formControlName]?.valid &&
        !this.noError,
      'input-file-icon':
        this.type === 'file' && this.iconPos === 'left' && this.inputIcon,
      'input-icon': this.inputIcon && this.iconPos === 'left',
      'input-ghost': this.ghost,
      //   'input-checkbox': this.type === 'checkbox',
    };
  }

  iconClass(): Object {
    return {
      'form-input-icon-right': this.iconPos === 'right',
    };
  }

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(value: any): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

type InputTypes = 'text' | 'number' | 'password' | 'file' | 'email';
