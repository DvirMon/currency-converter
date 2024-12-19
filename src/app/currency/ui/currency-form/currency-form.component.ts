import { KeyValuePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { distinctUntilChanged, filter, map, tap } from "rxjs";
import { CurrencyList } from "../../data-access/currency.model";
import { CurrencyFormService } from "./currency-form.service";

@Component({
  selector: "app-currency-form",
  imports: [
    KeyValuePipe,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: "./currency-form.component.html",
  styleUrl: "./currency-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyFormComponent {
  #currencyFormService = inject(CurrencyFormService);

  currencyList = input<CurrencyList | undefined>({});

  convert = model<{
    from: string;
    to: string;
  } | null>();

  amount = model<number>();

  selectedSymbol = model<string>();

  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm();

  amountControl = this.#currencyFormService.getAmountControl();

  #amountChanged$ = this.amountControl.valueChanges.pipe(
    map((value) => Number(value)),
    map((value) => (value > 0 ? value : 0)),
    distinctUntilChanged()
  );

  #convertChanged$ = this.currencyConverterForm.valueChanges.pipe(
    filter(() => this.currencyConverterForm.valid)
    // tap(() => {
    //   if (!this.amountControl.valid) {
    //     this.amountControl.setValue(1, { emitEvent: false });
    //   }
    // })
  );

  amountErrorMessage = this.#currencyFormService.setAmountErrorMessage(
    this.amountControl
  );

  sameCurrencyValidatorErrorMessage =
    this.#currencyFormService.getSameCurrencyErrorMessage(
      this.currencyConverterForm,
      this.amountControl
    );


  constructor() {
    this.#convertChanged$.pipe(takeUntilDestroyed()).subscribe((value) => {
      const { to, from } = value;

      if (to === from) {
        return;
      }

      this.convert.update(() => value as { from: string; to: string });
    });

    this.#amountChanged$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.amount.update(() => value);
    });
  }

  onCurrencySelectionChanged(event: MatSelectChange) {
    this.selectedSymbol.set(event.value);
  }

  setErrorMessage(control: FormControl<unknown>) {
    if (control.hasError("required")) {
      return "Amount is required";
    }

    if (control.hasError("pattern")) {
      return "Amount must be positive";
    }

    return "";
  }
}
