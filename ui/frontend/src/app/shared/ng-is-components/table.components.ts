import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './button.component';
@Component({
  selector: 'is-table',
  standalone: true,
  imports: [CommonModule, PopoverDirective, FormsModule, ButtonComponent],
  template: `
    <div class="data-table-wrapper">
      <div class="rounded-table-border">
        <table>
          <thead>
            <tr>
              <ng-container *ngFor="let fieldType of fields; let i = index">
                <th
                  *ngIf="fieldType.showInTable"
                  [ngClass]="{ sort: fieldType.showInTable }">
                  <div
                    class="sort-wrapper"
                    [ngClass]="{ 'sort-wrapper-hover': fieldType.sort }"
                    [isPopover]="
                      showTableHeadSorting &&
                      tempSortIndex === i &&
                      fieldType.sort
                    "
                    [appendTo]="'body'"
                    [position]="'bottom'"
                    [template]="tableHeadSortTemplate"
                    [templateContext]="i"
                    (click)="onTogglePopover('SORT', i)">
                    <span>{{ fieldType.name }}</span>
                    <i
                      *ngIf="fieldType.sort"
                      class="fa fa-solid fa-{{
                        sortOrder === 'ASC' && sortIndex === i
                          ? 'sort-up'
                          : sortOrder === 'DESC' && sortIndex === i
                          ? 'sort-down'
                          : 'sort'
                      }}"></i>
                  </div>
                </th>
              </ng-container>
              <th>
                <div
                  class="toggle-wrapper"
                  (click)="onTogglePopover('TOGGLE_COLUMN')"
                  [isPopover]="showToggleColumns"
                  [position]="'bottom-inline-right'"
                  [appendTo]="'body'"
                  [template]="toggleColumnsTemplate">
                  <i class="fa fa-solid fa-sliders"></i>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data$ | async as data; let i = index">
              <ng-container *ngFor="let column of fields; let colIndex = index">
                <td *ngIf="column.showInTable">
                  {{ row[column.type] }}
                </td>
              </ng-container>
              <td class="action-trigger">
                <i
                  class="fa fa-solid fa-ellipsis"
                  (click)="onTogglePopover('ACTION', i)"
                  [isPopover]="showActions && actionIndex === i"
                  [position]="'bottom-inline-right'"
                  [appendTo]="'body'"
                  [template]="actionsTemplate"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ng-template #actionsTemplate>
      <div class="default-actions-template">
        <!-- <div class="sort-options">Create</div>
        <div class="sort-options">Edit</div>
        <div class="divider"></div> -->
        <div class="sort-options text-danger">
          <i class="fa fa-solid fa-trash-can-xmark text-danger"></i>
          <span>Delete</span>
        </div>
      </div>
    </ng-template>

    <ng-template #tableHeadSortTemplate let-index>
      <div class="default-thead-sort-template">
        <div (click)="onSortTableRows('ASC')" class="sort-options">
          <i class="fa fa-solid fa-arrow-up-wide-short"></i>

          Asc
        </div>
        <div (click)="onSortTableRows('DESC')" class="sort-options">
          <i class="fa fa-solid fa-arrow-down-short-wide"></i>

          Desc
        </div>
        <div class="divider"></div>
        <div (click)="onToggleTableField(index)" class="sort-options">
          <i class="fa fa-solid fa-eye-slash"></i>
          Hide
        </div>
      </div>
    </ng-template>

    <ng-template #toggleColumnsTemplate>
      <div class="toggle-columns-container">
        <div class="toggle-columns-label">Toggle columns</div>
        <div class="divider"></div>
        <div
          *ngFor="let column of fields; let i = index"
          class="table-columns"
          (click)="onToggleTableField(i)">
          <i
            class="fa fa-solid fa-{{
              column.showInTable ? 'circle-check' : 'circle-xmark'
            }}"></i>
          {{ column.name }}
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      div.data-table-wrapper {
        div.rounded-table-border {
          -webkit-box-shadow: 7px 7px 49px 4px rgba(65, 72, 67, 0.15);
          -moz-box-shadow: 7px 7px 49px 4px rgba(65, 72, 67, 0.15);
          box-shadow: 7px 7px 49px 4px rgba(65, 72, 67, 0.15);
          border: 1px solid var(--border-color);
          border-radius: calc(0.5rem - 2px);
          overflow: hidden;
          table {
            width: 100%;
            font-size: 0.875rem;
            line-height: 1.25rem;
            text-indent: 0;
            border-collapse: collapse;
            background-color: var(--primary-medium);
            color: var(--text-dark);
            user-select: none;
            thead {
              tr {
                th.sort {
                  padding-left: 0;
                  transition-duration: 0.15s;
                  transition-property: background-color, color;
                  i.fa {
                    margin-left: 0.25rem;
                  }
                }
                div.sort-wrapper {
                  display: flex;
                  align-items: center;
                  margin-left: 0.25rem;
                  padding: 0.5rem 1rem;
                  width: min-content;
                  transition-duration: 0.15s;
                  transition-property: background-color, color;
                  border-radius: calc(0.5rem - 2px);
                }
                div.sort-wrapper-hover:hover {
                  background-color: var(--primary-light);
                  color: var(--text-accent);
                  cursor: pointer;
                }
                div.toggle-wrapper {
                  display: flex;
                  justify-content: center;
                  width: 100%;
                  i.fa {
                    transition-duration: 0.15s;
                    transition-property: background-color, color;
                  }
                }
                div.toggle-wrapper:hover {
                  i.fa {
                    background-color: var(--primary-light);
                    color: var(--text-accent);
                    cursor: pointer;
                  }
                }
              }
            }
            tbody {
              tr {
                transition-duration: 0.15s;
                transition-property: background-color;
                border-top: 1px solid var(--border-color);
              }
              tr:hover {
                background-color: var(--primary-light);
                color: var(--text-accent);
              }
            }
            th {
              color: var(--text-medium);
              font-weight: 500;
              vertical-align: middle;
              text-align: left;
              height: 3rem;
            }
            td {
              vertical-align: middle;
              padding: 1rem;
              overflow: hidden;
              max-width: 200px;
            }
            td.action-trigger {
              text-align: center;
              i.fa {
                transition-duration: 0.15s;
                transition-property: background-color, color;
                padding: 0.25rem 0.5rem;
                border-radius: calc(0.5rem - 2px);
              }
              i.fa:hover {
                cursor: pointer;
                background-color: var(--primary-medium);
              }
            }
          }
        }
      }
      div.default-thead-sort-template,
      div.default-actions-template,
      div.toggle-columns-container {
        background-color: var(--primary-medium);
        border-radius: calc(0.5rem - 2px);
        border: 1px solid var(--border-color);
        color: var(--text-medium);
        padding: 0.25rem;
        user-select: none;
        margin-top: calc(0.5rem - 1px);
        div.sort-options,
        div.toggle-columns-label,
        div.table-columns {
          transition-duration: 0.15s;
          transition-property: background-color, color;
          padding: 0.5rem;
          border-radius: calc(0.5rem - 4px);
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        div.sort-options:hover,
        div.table-columns:hover {
          background-color: var(--primary-light);
          color: var(--text-accent);
          cursor: pointer;
          i.fa {
            color: var(--text-accent);
          }
        }
        div.divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 0.25rem 0;
        }
        i.fa {
          margin-right: 0.25rem;
          width: 14px;
          height: 14px;
          color: var(--text-medium);
        }
        div.toggle-columns-label {
          font-weight: 600;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsTableComponent {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input('headerTemplate') headerTemplate?: TemplateRef<any>;
  @Input('data') data: any[] = [];

  fields: any;
  data$?: Observable<any>;
  sortAction$: BehaviorSubject<null> = new BehaviorSubject<null>(null);

  ngOnInit(): void {
    // Transform field names to title case
    this.fields = Object.keys(this.data[0]).map((x: string) => {
      return {
        name: x[0].toUpperCase() + x.slice(1),
        type: x,
        showInTable: true,
        sort: true,
      };
    });

    this.data$ = this.sortAction$.pipe(
      switchMap(() => {
        if (this.sortIndex !== -1) {
          this.data.sort((a, b) => {
            return a[this.fields[this.sortIndex].name.toLowerCase()] <
              b[this.fields[this.sortIndex].name.toLowerCase()]
              ? this.sortOrder === 'ASC'
                ? -1
                : 1
              : this.sortOrder === 'ASC'
              ? 1
              : -1;
          });
        }
        return of(this.data);
      })
    );
  }

  sortOrder?: 'ASC' | 'DESC';
  tempSortIndex: number = -1;
  sortIndex: number = -1;
  actionIndex: number = -1;
  filterIndex: number = -1;

  showActions: boolean = false;
  showTableHeadSorting: boolean = false;
  showToggleColumns: boolean = false;
  showFilter: boolean = false;

  filters: any[] = [
    {
      name: 'Status',
      type: 'status',
    },
    {
      name: 'Task',
      type: 'task',
    },
  ];

  onTogglePopover(type: PopoverType, index?: number): void {
    switch (type) {
      case 'SORT':
        // Toggle sort popover
        this.showTableHeadSorting =
          this.tempSortIndex !== index ? true : !this.showTableHeadSorting;
        this.tempSortIndex = index!;
        // Close all other popovers
        this.showActions = false;
        this.actionIndex = -1;
        this.showToggleColumns = false;
        break;
      case 'ACTION':
        // Toggle actions popover
        this.showActions =
          this.actionIndex !== index ? true : !this.showActions;
        this.actionIndex = index!;
        // Close all other popovers
        this.showTableHeadSorting = false;
        this.tempSortIndex = -1;
        this.showToggleColumns = false;
        break;
      case 'TOGGLE_COLUMN':
        // Toggle columns popover
        this.showToggleColumns = !this.showToggleColumns;
        // Close all other popovers
        this.showTableHeadSorting = false;
        this.tempSortIndex = -1;
        this.showActions = false;
        this.actionIndex = -1;
        break;
      default:
        break;
    }
  }

  onSortTableRows(order: 'ASC' | 'DESC'): void {
    this.sortOrder = order;
    this.sortIndex = this.tempSortIndex;
    this.sortAction$.next(null);
    this.showTableHeadSorting = false;
  }

  onToggleTableField(index: number): void {
    this.showTableHeadSorting = false;
    this.tempSortIndex = -1;
    // this.showToggleColumns = false;
    this.cdr.detectChanges();
    this.fields[index].showInTable = !this.fields[index].showInTable;
    this.cdr.detectChanges();
  }
}

export type PopoverType = 'SORT' | 'ACTION' | 'TOGGLE_COLUMN';
