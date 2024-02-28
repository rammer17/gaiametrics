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
import { CommonModule, NgFor } from '@angular/common';
import { FormErrorComponent } from './form-error.component';
import { PopoverDirective } from './popover.directive';

@Component({
  selector: 'app-form-multiselect',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormErrorComponent,
    NgFor,
    PopoverDirective,
  ],
  template: `
    <div class="mt-4">
      <div class="w-100 mb-2">{{ placeholder }}</div>
      <div [ngClass]="wrapperClass()" class="w-100">
        <input
          readonly
          autocomplete="off"
          #input
          id="input"
          title=""
          (focus)="showDropdownOptions = true"
          (blur)="showDropdownOptions = false"
          [placeholder]="'Choose an option'"
          [ngModel]="value?.length + ' selected'"
          class="form-input"
          [isPopover]="showDropdownOptions"
          [appendTo]="'body'"
          [position]="'bottom-inline-left'"
          [template]="dropdownTemplate" />
        <ng-template #dropdownTemplate>
          <ul class="dropdown">
            <li
              *ngFor="let option of data"
              class="dropdown-option"
              [ngClass]="{ 'selected-option': option.selected }"
              (click)="onInputChange(option)">
              <i
                class="fa fa-regular fa-square"
                [ngClass]="{ 'fa-square-check': option.selected }"></i>
              {{ option.name }}
            </li>
          </ul>
        </ng-template>
      </div>
      <app-form-error
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
      .dropdown-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column !important;
      }
      .dropdown-wrapper:focus-within {
        .form-input::placeholder {
          opacity: 0;
        }
      }
      .dropdown {
        list-style: none;
        border-radius: calc(0.5rem - 2px);
        border: 1px solid var(--border-color);
        width: 100%;
        margin: 0;
        padding: 0;
        max-height: 200px;
        overflow-y: auto;
        li {
          padding: 0.5rem 0.75rem;
          background-color: var(--primary-medium);
          list-style: none;
          transition: 0.15s all;
        }
        li:hover {
          cursor: pointer;
          background-color: var(--primary-light);
          color: var(--text-accent);
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
      .selected-option {
        background-color: var(--primary-light) !important;
        color: var(--text-accent);
      }
    `,
  ],
  //   changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormMultiselectComponent),
      multi: true,
    },
  ],
})
export class FormMultiselectComponent implements ControlValueAccessor {
  @Input({ alias: 'formControlName', required: true }) formControlName: any;
  @Input({ alias: 'data', required: true }) data: any;
  @Input({ alias: 'placeholder', required: true }) placeholder: string = '';
  @Input({ alias: 'disabled', required: false }) disabled: boolean = false;

  value: any;
  showDropdownOptions: boolean = false;

  readonly hostFormGroup: FormGroupDirective = inject(FormGroupDirective);

  ngOnInit(): void {
    this.data = this.data.map((x: any) => {
      x['selected'] = false;
      return x;
    });
  }

  wrapperClass(): Object {
    return {
      'dropdown-wrapper': true,
      'input-destructive':
        this.hostFormGroup?.control?.controls[this.formControlName]?.invalid &&
        this.hostFormGroup?.control?.controls[this.formControlName]?.touched,
      'input-success':
        this.hostFormGroup?.control?.controls[this.formControlName]?.valid,
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
    if (!this.value) {
      this.value = [value];
    } else if (!value.selected) {
      this.value = [...this.value, value];
      console.log(this.value);
    } else {
      console.log(this.value);
      this.value = this.value.filter((x: any) => {
        console.log(x.id, value.id);
        return x.value !== value.value;
      });
    }

    value['selected'] = !value['selected'];
    // this.value = value;
    this.onChange(this.value);
    this.onTouched();
  }
}
