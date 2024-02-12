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
import {
  Observable,
  BehaviorSubject,
  merge,
  switchMap,
  of,
  combineLatest,
  from,
  distinct,
  filter,
  map,
  toArray,
  ReplaySubject,
  scan,
  tap,
  startWith,
  shareReplay,
} from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'is-table',
  standalone: true,
  imports: [CommonModule, PopoverDirective, FormsModule],
  template: `
    <!-- <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Contact</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ernst Handel</td>
          <td>Roland Mendel</td>
          <td>Austria</td>
        </tr>
      </tbody>
    </table> -->

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
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data$ | async; let i = index">
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
        <div class="sort-options">Create</div>
        <div class="sort-options">Edit</div>
        <div class="divider"></div>
        <div class="sort-options">Delete</div>
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
                  fa-icon {
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
                  background-color: var(--accent-dark);
                  color: var(--text-accent);
                  cursor: pointer;
                }
              }
              tr:hover {
                background-color: var(--text-accent);
              }
            }
            tbody {
              tr {
                transition-duration: 0.15s;
                transition-property: background-color;
                border-top: 1px solid var(--border-color);
              }
              tr:hover {
                background-color: var(--accent-dark);
                color: var(--text-accent);
              }
            }
            th {
              color: var(--text-medium);
              font-weight: 500;
              vertical-align: middle;
              text-align: left;
              // padding-left: 1rem;
              // padding-right: 1rem;
              height: 3rem;
            }
            th:has(> input[type='checkbox']) {
              padding-right: 0;
            }
            td {
              vertical-align: middle;
              padding: 1rem;
            }
            td.action-trigger {
              text-align: center;
              fa-icon {
                transition-duration: 0.15s;
                transition-property: background-color, color;
                padding: 0.25rem 0.5rem;
                border-radius: calc(0.5rem - 2px);
              }
              fa-icon:hover {
                cursor: pointer;
                background-color: var(--primary-dark);
              }
            }
          }
        }
      }
      div.default-thead-sort-template,
      div.default-actions-template,
      div.toggle-columns-container,
      div.filter-options-container {
        background-color: var(--primary-medium);
        border-radius: calc(0.5rem - 2px);
        border: 1px solid var(--border-color);
        color: var(--text-medium);
        padding: 0.25rem;
        font-family: '__Inter_0ec1f4', '__Inter_Fallback_0ec1f4', ui-sans-serif,
          system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
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
          background-color: var(--accent-dark);
          color: var(--text-accent);
          cursor: pointer;
        }
        div.divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 0.25rem 0;
        }
        fa-icon {
          margin-right: 0.25rem;
          width: 14px;
          height: 14px;
          color: var(--text-medium);
        }
        div.toggle-columns-label {
          font-weight: 600;
        }
        div.search-bar {
          input[type='checkbox'] {
            display: inline-block;
          }
          div.no-results {
            text-align: center;
            padding: 0.75rem 1rem;
          }
        }
        div.filter-options {
          display: flex;
          gap: 0.5rem;
        }
      }
      div.default-header-template {
        margin-bottom: 0.75rem;
        display: flex;
        justify-content: space-between;
        div.header-filters {
          display: flex;
          gap: 0.25rem;
          div.filter-values {
            display: inline-flex;
            justify-content: space-around;
            gap: 0.25rem;
            // align-items: center;
            div.vertical-divider {
              margin-left: 0.25rem;
              width: 1px;
              background-color: var(--border-color);
            }
            div.active-filter-container {
              padding: 0.125rem 0.25rem;
              border-radius: calc(0.5rem - 4px);
              background-color: var(--primary-dark);
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsTableComponent {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input('headerTemplate') headerTemplate?: TemplateRef<any>;
  @Input('footerTemplate') footerTemplate?: TemplateRef<any>;
  @Input('data') data: any[] = [
    {
      task: 'TASK-8782',
      title:
        'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
      status: 'B',
    },
    {
      task: 'TASK-7878',
      title: 'We need to bypass the neural TCP card!',
      status: 'A',
    },
    {
      task: 'TASK-8686',
      title:
        "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: 'B',
    },
    {
      task: 'TASK-8782',
      title:
        'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
      status: 'C',
    },
    {
      task: 'TASK-7878',
      title: 'We need to bypass the neural TCP card!',
      status: 'A',
    },
    {
      task: 'TASK-8686',
      title:
        "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: 'D',
    },
    {
      task: 'TASK-8782',
      title:
        'Try to calculate the EXE feed, maybe it will index the multi-byte pixel!',
      status: 'B',
    },
    {
      task: 'TASK-7878',
      title: 'We need to bypass the neural TCP card!',
      status: 'AB',
    },
    {
      task: 'TASK-8686',
      title:
        "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: 'Y',
    },
  ];

  fields: any;
  data$?: Observable<any>;
  sortAction$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  filterAction$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  availableFilters$?: Observable<any>;
  refetchFilters$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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

    this.data$ = merge(this.sortAction$, this.filterAction$).pipe(
      switchMap((currentActiveFilters: object[]) => {
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

        // console.log(currentActiveFilters);

        // return of(this.data);

        const filteredData = currentActiveFilters?.length
          ? this.filterData(this.data, currentActiveFilters)
          : this.data;

        return of(filteredData);
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

  onTogglePopover(type: PopoverType, index?: number, filterType?: any): void {
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
        this.showFilter = false;
        this.filterIndex = -1;
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
        this.showFilter = false;
        this.filterIndex = -1;
        break;
      case 'TOGGLE_COLUMN':
        // Toggle columns popover
        this.showToggleColumns = !this.showToggleColumns;
        // Close all other popovers
        this.showTableHeadSorting = false;
        this.tempSortIndex = -1;
        this.showActions = false;
        this.actionIndex = -1;
        this.showFilter = false;
        this.filterIndex = -1;
        break;
      case 'FILTER':
        // Toggle columns popover
        this.showFilter = this.filterIndex !== index ? true : !this.showFilter;
        this.filterIndex = index!;
        // Close all other popovers
        this.showTableHeadSorting = false;
        this.tempSortIndex = -1;
        this.showActions = false;
        this.actionIndex = -1;
        this.showToggleColumns = false;

        //Reset input value
        this.refetchFilters$.next('');

        // Get all available distinct values for filtering based on the input data
        this.availableFilter$ = combineLatest([
          this.activeFilter$,
          this.refetchFilters$.pipe(
            switchMap((filterInputValue: string) =>
              from(this.data).pipe(
                distinct((x: any) => x[filterType]),
                filter((x: any) =>
                  this.doesValueContainFilterInputValue(
                    x[filterType],
                    filterInputValue
                  )
                ),
                map((x: any) => x[filterType]),
                toArray()
              )
            )
          ),
        ]).pipe(
          map((x: any[]) => [...new Set(x.flat(1)).values()])
          // tap((x) => console.log(x))
        );
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

  onFilterAutocomplete(inputValue: string): void {
    this.refetchFilters$.next(inputValue);
  }

  onFilterChange(filterValue: any, filterType: string): void {
    // console.log(filterType);
    this.activeFilterSource$.next({ [filterType]: filterValue });
  }

  availableFilter$?: Observable<any>;
  activeFilterSource$: ReplaySubject<any> = new ReplaySubject<any>(1);
  activeFilter$: Observable<any> = this.activeFilterSource$.pipe(
    scan(
      (accumulator: any[], currentValue: any) => {
        return accumulator.some(
          (e) =>
            e[Object.keys(currentValue)[0]] === Object.values(currentValue)[0]
        )
          ? [
              ...accumulator.filter(
                (x: any) =>
                  Object.keys(x).length &&
                  Object.values(x)[0] !== Object.values(currentValue)[0]
              ),
            ]
          : [
              ...accumulator.filter((x: any) => Object.keys(x).length),
              currentValue,
            ];
      },
      [{}]
    ),
    tap((x) => {
      console.log(x);
      this.filterAction$.next(x);
    }),
    startWith([]),
    shareReplay(1)
  );

  determineIfFilterIsChecked(
    activeFiltersArr: object[],
    filterToCheck: any
  ): boolean {
    return activeFiltersArr.some((e) => Object.values(e)[0] === filterToCheck);
  }

  // activeFiltersCountLessThan3(activeFilters: object[], filterType: string): boolean {
  //   const count = activeFilters.filter((activeFilter) =>
  //     activeFilter.hasOwnProperty(filterType)
  //   ).length;
  //   return count < 3;
  // }

  private doesValueContainFilterInputValue(
    string: string,
    substring: string
  ): boolean {
    return string.toLowerCase().includes(substring.toLowerCase());
  }

  private filterData(data: any[], currentActiveFilters: any[]): any {
    let filteredData: any[] = data;

    // Get all distinct active filter object keys
    const allActiveFilterValues = [
      ...new Set(currentActiveFilters.map((x) => Object.values(x)[0])),
    ];

    currentActiveFilters.forEach((activeFilter: any) => {
      filteredData = filteredData.filter((value: any) => {
        return allActiveFilterValues.includes(
          value[Object.keys(activeFilter)[0]]
        );
      });
    });

    return filteredData;
  }
}

export type PopoverType = 'SORT' | 'ACTION' | 'TOGGLE_COLUMN' | 'FILTER';
