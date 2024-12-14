import { isPlatformBrowser, KeyValuePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
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
import { MatSelectModule } from "@angular/material/select";
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  iif,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from "rxjs";
import { CurrencyList } from "../../data-access/currency.model";
import { CurrencyFormService } from "./currency-form.service";
import { StorageService } from "../../../shared/services/storage.service";
import { SESSION_KEYS } from "../../../shared/services/storage.keys";

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

  #storageService = inject(StorageService);

  #sessionKeys = inject(SESSION_KEYS);

  currencyList = input<CurrencyList | undefined>({});

  convertChanged = output<
    | {
        from: string;
        to: string;
      }
    | undefined
  >();
  amountChanged = output<number>();

  currencyChanged = output<string>();


  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm(
  );

  amountControl = this.#currencyFormService.getAmountControl();
  toControl = this.currencyConverterForm.controls.to;
  fromControl = this.currencyConverterForm.controls.from;

  toValue$ = this.toControl.valueChanges.pipe(startWith(this.toControl.value));

  fromValue$ = this.fromControl.valueChanges.pipe(
    startWith(this.fromControl.value)
  );

  toValue = toSignal(this.toValue$, {
    initialValue: this.toControl.value,
  });

  fromValue = toSignal(this.fromValue$, {
    initialValue: this.fromControl.value,
  });

  amountValue = toSignal(
    this.amountControl.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.amountControl.valid)
    ),
    { initialValue: this.amountControl.value }
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

  currencyFormValue = computed(() => {
    return {
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  currencyFormValues$ = toObservable(this.currencyFormValue);

  convertTrigger$ = this.currencyFormValues$.pipe(
    filter(() => this.currencyConverterForm.valid),
    tap(() => {
      if (!this.amountControl.valid) {
        this.amountControl.setValue("1");
      }
    })
  );

  amountRateValue$ = this.amountControl.valueChanges.pipe(
    map((value) => Number(value)),
    map((value) => (value > 0 ? value : 0)),
    distinctUntilChanged()
  );

  hasCurrencyValidator$ = this.currencyConverterForm.statusChanges.pipe(
    startWith(this.currencyConverterForm.status),
    map(() => this.currencyConverterForm.errors),
    map((errors) => errors && errors["sameCurrency"])
  );

  sameCurrencyValidatorErrorMessage$ = this.hasCurrencyValidator$.pipe(
    switchMap((hasError) =>
      iif(
        () => hasError,
        of("The from and to currencies must be different"),
        of("")
      )
    )
  );

  sameCurrencyValidatorErrorMessage = toSignal(
    this.sameCurrencyValidatorErrorMessage$
  );

  currencySelectionChanged$ = merge(
    toObservable(this.toValue),
    toObservable(this.fromValue)
  ).pipe(
    filter((value) => !!value),
    distinctUntilChanged()
  );

  saveControlsValues$ = combineLatest([
    toObservable(this.toValue),
    toObservable(this.fromValue),
    toObservable(this.amountValue).pipe(debounceTime(300)),
  ]).pipe(
    filter(() => this.currencyConverterForm.valid && this.amountControl.valid),
    map(([to, from, amount]) => ({ to, from, amount }))
  );

  constructor() {
    this.convertTrigger$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.convertChanged.emit(value);
    });

    //TODO - emit amount only when form is valid
    this.amountRateValue$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.amountChanged.emit(value);
    });

    this.currencySelectionChanged$
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.currencyChanged.emit(value);
      });

    this.saveControlsValues$.pipe(takeUntilDestroyed()).subscribe((value) => {
      console.info("saveControlsValues", value);
      this.#storageService.setToSession(this.#sessionKeys.FORM_VALUES, value);
    });
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
