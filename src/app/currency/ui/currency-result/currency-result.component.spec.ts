import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyResultComponent } from './currency-result.component';

describe('CurrencyResultComponent', () => {
  let component: CurrencyResultComponent;
  let fixture: ComponentFixture<CurrencyResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
