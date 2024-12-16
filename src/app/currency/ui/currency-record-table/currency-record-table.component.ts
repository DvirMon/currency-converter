import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HistoryRecord } from '../../data-access/history.service';
import { CurrencyConvertPipe } from '../../utils/currency-convert.pipe';

@Component({
  selector: 'app-currency-record-table',
  imports: [MatTableModule, DatePipe, CurrencyConvertPipe, CurrencyPipe],
  templateUrl: './currency-record-table.component.html',
  styleUrl: './currency-record-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyRecordTableComponent {


    
  dataSource = input.required<HistoryRecord[]>();

  displayedColumns = input.required<string[]>();

}
