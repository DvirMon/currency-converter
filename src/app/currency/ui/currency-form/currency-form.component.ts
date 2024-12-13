import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
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
import { MatSelectModule } from "@angular/material/select";
import {
  debounceTime,
  filter,
  take,
  merge,
  map,
  combineLatest,
  switchMap,
  skipWhile,
  distinctUntilChanged,
  tap,
  startWith,
  distinctUntilKeyChanged,
  pairwise,
  iif,
  of,
} from "rxjs";
import { CurrencyFormService } from "./currency-form.service";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  selector: "app-currency-form",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: "./currency-form.component.html",
  styleUrl: "./currency-form.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyFormComponent {
  #currencyFormService = inject(CurrencyFormService);

  currencyList = input<string[] | undefined>([]);

  convertChanged = output<
    | {
        // amount: string;
        from: string;
        to: string;
      }
    | undefined
  >();
  amountChanged = output<number>();

  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
    amount: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm();

  amountControl = this.currencyConverterForm.controls.amount;
  toControl = this.currencyConverterForm.controls.to;
  fromControl = this.currencyConverterForm.controls.from;

  toValue = toSignal(
    this.toControl.valueChanges.pipe(
      startWith(this.toControl.value),
      pairwise(),
      tap(([prev, curr]) => {
        if (curr === this.fromControl.value) {
          this.fromControl.setValue(prev);
        }
      }),
      map(([prev, curr]) => curr)
    ),
    {
      initialValue: this.toControl.value,
    }
  );

  fromValue = toSignal(
    this.fromControl.valueChanges.pipe(
      startWith(this.fromControl.value),
      pairwise(),
      tap(([prev, curr]) => {
        if (curr === this.toControl.value) {
          this.toControl.setValue(prev);
        }
      }),
      map(([prev, curr]) => curr)
    ),
    {
      initialValue: this.fromControl.value,
    }
  );

  amountValue = toSignal(
    this.amountControl.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.amountControl.valid)
      // take(1)
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

  formValue = computed(() => {
    return {
      // amount: this.amountValue(),
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  formValues$ = toObservable(this.formValue);

  convertTrigger$ = this.formValues$.pipe(
    filter(() => this.fromControl.valid && this.toControl.valid)
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

  constructor() {
    this.convertTrigger$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.convertChanged.emit(value);
    });

    //TODO - emit amount only when form is valid
    this.amountRateValue$.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.amountChanged.emit(value);
    });
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
