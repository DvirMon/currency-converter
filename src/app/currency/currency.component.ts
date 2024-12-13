import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import {
  ControlEvent,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  TouchedChangeEvent,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyFormService } from "./data-access/currency-form.service";
import { CurrencyHttpService } from "./data-access/currency-http.service";

import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from "@angular/core/rxjs-interop";
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  merge,
  startWith,
  take,
  tap,
} from "rxjs";
import { AsyncPipe, CurrencyPipe, JsonPipe } from "@angular/common";
// import { HistoryService } from "../history/history.service";

@Component({
  selector: "app-currency",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyPipe,
    // JsonPipe,
    // AsyncPipe,
  ],
  templateUrl: "./currency.component.html",
  styleUrl: "./currency.component.scss",
  host: { ngSkipHydration: "true" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CurrencyHttpService, CurrencyFormService],
})
export class CurrencyComponent {
  #currencyHttpService = inject(CurrencyHttpService);
  #currencyFormService = inject(CurrencyFormService);
  // #historyService = inject(HistoryService);

  currencyResource = this.#currencyHttpService.getCurrencyList();

  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
    amount: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm();

  amountControl = this.currencyConverterForm.controls.amount;
  toControl = this.currencyConverterForm.controls.to;
  fromControl = this.currencyConverterForm.controls.from;

  toValue = toSignal(this.toControl.valueChanges, {
    initialValue: "",
  });

  fromValue = toSignal(this.fromControl.valueChanges, {
    initialValue: "",
  });

  amountValue = toSignal(
    this.amountControl.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.amountControl.valid),
      take(1)
    ),
    { initialValue: "" }
  );

  amountTouchedEvent$ = this.amountControl.events.pipe(
    filter((event) => event instanceof TouchedChangeEvent),
    filter((event: TouchedChangeEvent) => event.touched)
  );

  amountError$ = merge(
    this.amountControl.statusChanges,
    this.amountControl.valueChanges,
    this.amountTouchedEvent$
  ).pipe(map(() => this.setErrorMessage(this.amountControl)));

  amountErrorMessage = toSignal(this.amountError$);

  amountRateValue = toSignal(
    this.amountControl.valueChanges.pipe(map((value) => Number(value))),
    { initialValue: 0 }
  );

  formValue = computed(() => {
    return {
      amount: this.amountValue(),
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  isFormValid$ = this.currencyConverterForm.statusChanges.pipe(
    map((status) => status === "VALID")
  );

  formValues$ = toObservable(this.formValue);

  convertTrigger$ = combineLatest([this.isFormValid$, this.formValues$]).pipe(
    map(([valid, values]) => (valid ? values : undefined))
  );

  convertTrigger = toSignal(this.convertTrigger$);

  ratesResource = this.#currencyHttpService.getCurrencyRates(
    this.convertTrigger
  );

  rate = computed(() => this.ratesResource.value()?.rates);

  rateConverted = computed(() => {
    const rates = this.rate();
    const to = this.toValue();
    const amount = this.amountRateValue();
    return rates ? this.#convert(rates, to, amount) : "0";
  });

  #convert(rates: Record<string, number>, to: string, amount: number): string {
    return (amount * rates[to]).toFixed(2);
  }

  setErrorMessage(control: FormControl<string>) {
    if (control.hasError("required")) {
      return "Amount is required";
    }

    if (control.hasError("pattern")) {
      return "Amount must be positive";
    }

    return "";
  }
}
