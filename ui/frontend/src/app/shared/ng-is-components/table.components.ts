import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'is-table',
  standalone: true,
  template: `
    <table>
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
    </table>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsTableComponent {}
