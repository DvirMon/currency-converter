import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { CurrencyFormService } from "./data-access/currency-form.service";
import { CurrencyHttpService } from "./data-access/currency-http.service";

import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  take
} from "rxjs";
import { HistoryService } from "../history/history.service";

@Component({
  selector: "app-currency",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
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
  #historyService = inject(HistoryService);

  currencyResource = this.#currencyHttpService.getCurrencyList();

  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
    amount: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm();

  toValue = toSignal(this.currencyConverterForm.controls["to"].valueChanges, {
    initialValue: "",
  });

  fromValue = toSignal(
    this.currencyConverterForm.controls["from"].valueChanges,
    {
      initialValue: "",
    }
  );

  amountValue = toSignal(
    this.currencyConverterForm.controls["amount"].valueChanges.pipe(
      debounceTime(300),
      filter(() => this.currencyConverterForm.controls["amount"].valid),
      take(1)
    ),
    { initialValue: "" }
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

}
