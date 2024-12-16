import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyRecordCardComponent } from './currency-record-card.component';

describe('CurrencyRecordCardComponent', () => {
  let component: CurrencyRecordCardComponent;
  let fixture: ComponentFixture<CurrencyRecordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyRecordCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyRecordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
