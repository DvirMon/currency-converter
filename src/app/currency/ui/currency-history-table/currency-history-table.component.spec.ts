import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyHistoryTableComponent } from './currency-history-table.component';

describe('CurrencyHistoryTableComponent', () => {
  let component: CurrencyHistoryTableComponent;
  let fixture: ComponentFixture<CurrencyHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
