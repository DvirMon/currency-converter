import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyRecordTableComponent } from './currency-record-table.component';

describe('CurrencyRecordTableComponent', () => {
  let component: CurrencyRecordTableComponent;
  let fixture: ComponentFixture<CurrencyRecordTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyRecordTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyRecordTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
