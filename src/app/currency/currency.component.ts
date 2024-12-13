import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Signal,
} from "@angular/core";
import {
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

import { CurrencyPipe } from "@angular/common";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, debounceTime, filter, map, merge, take } from "rxjs";
import { CurrencyFormComponent } from "./ui/currency-form/currency-form.component";
import { CurrencyResultComponent } from "./ui/currency-result/currency-result.component";
// import { HistoryService } from "../history/history.service";

@Component({
  selector: "app-currency",
  imports: [
    CurrencyPipe,
    CurrencyFormComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CurrencyFormComponent,
    CurrencyResultComponent,
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

  convertWriteTrigger = signal<
    | {
        amount: string;
        from: string;
        to: string;
      }
    | undefined
  >(undefined);

  onConvertChanged(
    event: Signal<
      | {
          amount: string;
          from: string;
          to: string;
        }
      | undefined
    >
  ) {
    this.convertWriteTrigger.set(event());
  }

  amount = signal<number>(0);

  onAmountChanged(amount: number) {
    this.amount.set(amount);
  }

  ratesResource = this.#currencyHttpService.getCurrencyRates(
    this.convertWriteTrigger
  );

  rate = computed(() => this.ratesResource.value()?.rates);

  rateConverted = computed(() => {
    const rates = this.rate();
    const data = this.convertWriteTrigger();
    const amount = this.amount();

    if (rates && data) {
      const { to } = data;
      return this.#convert(rates, to, amount);
    }

    return "0";
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
