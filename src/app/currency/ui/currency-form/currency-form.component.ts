import { KeyValuePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  TouchedChangeEvent,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  iif,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { SESSION_KEYS } from "../../../shared/services/storage.keys";
import { StorageService } from "../../../shared/services/storage.service";
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
  toControl = this.currencyConverterForm.controls.to;
  fromControl = this.currencyConverterForm.controls.from;

  toValue$ = this.toControl.valueChanges.pipe(startWith(this.toControl.value));

  fromValue$ = this.fromControl.valueChanges.pipe(
    startWith(this.fromControl.value)
  );

  amountValue$ = this.amountControl.valueChanges.pipe(
    // startWith(this.amountControl.value),
    map((value) => Number(value)),
    map((value) => (value > 0 ? value : 0)),
    distinctUntilChanged()
  );

  toValue = toSignal(this.toValue$, {
    initialValue: this.toControl.value,
  });

  fromValue = toSignal(this.fromValue$, {
    initialValue: this.fromControl.value,
  });

  amountValue = toSignal(this.amountValue$, {
    initialValue: +this.amountControl.value,
  });

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

  currencyFormValue = computed(() => {
    return {
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  currencyFormValues$ = toObservable(this.currencyFormValue);

  convertTrigger$ = this.currencyConverterForm.valueChanges.pipe(
    filter(() => this.currencyConverterForm.valid),
    tap(() => {
      if (!this.amountControl.valid) {
        this.amountControl.setValue(1);
      }
    })
  );

  hasSameCurrencyError$ = this.currencyConverterForm.statusChanges.pipe(
    startWith(this.currencyConverterForm.status),
    map(() => this.currencyConverterForm.errors),
    map((errors) => errors && errors["sameCurrency"])
  );

  sameCurrencyValidatorErrorMessage$ = this.hasSameCurrencyError$.pipe(
    switchMap((hasError) =>
      iif(
        () => hasError,
        of("The from and to currencies must be different").pipe(
          tap(() => this.amountControl.disable({ emitEvent: false }))
        ),
        of("").pipe(tap(() => this.amountControl.enable()))
      )
    )
  );

  sameCurrencyValidatorErrorMessage = toSignal(
    this.sameCurrencyValidatorErrorMessage$
  );


  constructor() {
    this.convertTrigger$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.convert.update(() => value as { from: string; to: string });
    });

    this.amountValue$.pipe(takeUntilDestroyed()).subscribe((value) => {
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
