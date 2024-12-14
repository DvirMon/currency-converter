import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output
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
  distinctUntilChanged,
  filter,
  iif,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap
} from "rxjs";
import { CurrencyFormService } from "./currency-form.service";

@Component({
  selector: "app-currency-form",
  imports: [
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

  currencyChanged = output<string>();

  currencyConverterForm: FormGroup<{
    from: FormControl<string>;
    to: FormControl<string>;
    // amount: FormControl<string>;
  }> = this.#currencyFormService.createCurrencyConverterForm();

  amountControl = this.#currencyFormService.getAmountControl();
  toControl = this.currencyConverterForm.controls.to;
  fromControl = this.currencyConverterForm.controls.from;

  toValue$ = this.toControl.valueChanges.pipe(startWith(this.toControl.value));

  fromValue$ = this.fromControl.valueChanges.pipe(
    startWith(this.fromControl.value)
  );

  toValue = toSignal(
    this.toValue$
      .pipe
      // pairwise(),
      // tap(([prev, curr]) => {
      //   if (curr === this.fromControl.value) {
      //     this.fromControl.setValue(prev);
      //   }
      // }),
      // map(([prev, curr]) => curr)
      (),
    {
      initialValue: this.toControl.value,
    }
  );

  fromValue = toSignal(
    this.fromValue$
      .pipe
      // startWith(this.fromControl.value),
      // pairwise(),
      // tap(([prev, curr]) => {
      //   if (curr === this.toControl.value) {
      //     this.toControl.setValue(prev);
      //   }
      // }),
      // map(([prev, curr]) => curr)
      (),
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
      // amount: this.amountValue(),
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  currencyFormValues$ = toObservable(this.currencyFormValue);

  convertTrigger$ = this.currencyFormValues$.pipe(
    filter(() => this.currencyConverterForm.valid),
    tap(() => {
      if (!this.amountControl.valid) {
        // console.log("invalid");
        this.amountControl.setValue("1");
      }
    })
  );

  amountRateValue$ = this.amountControl.valueChanges.pipe(
    map((value) => Number(value)),
    map((value) => (value > 0 ? value : 0)),
    distinctUntilChanged()
    // startWith(this.amountControl.value),
  );

  // Validators section

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

  // events section

  // currencySelectionChanged$ = this.currencySelectionChangedSource
  //   .asObservable()
  //   .pipe(
  //     startWith(this.toControl.value),
  //     pairwise(),
  //     map(([prev, curr]) => {
  //       if (prev === curr) {
  //         const toValue = this.toControl.value;
  //         const fromValue = this.fromControl.value;
  //         console.log(toValue, fromValue);

  //         console.log("same currency", prev, curr);

  //         return toValue !== prev ? toValue : fromValue;
  //       }
  //       // this.currencySelectionChangedSource.next(this.fromControl.value);

  //       return curr;
  //     }),
  //     filter((value) => !!value),
  //     distinctUntilChanged()
  //   );

  // currently has double events
  currencySelectionChanged$ = merge(
    toObservable(this.toValue),
    toObservable(this.fromValue)
  ).pipe(
    filter((value) => !!value),
    distinctUntilChanged()
  );

  constructor() {
    this.convertTrigger$.pipe(takeUntilDestroyed()).subscribe((value) => {
      console.log("emit form");
      this.convertChanged.emit(value);
    });

    //TODO - emit amount only when form is valid
    this.amountRateValue$.pipe(takeUntilDestroyed()).subscribe((value) => {
      console.log("amount", value);
      this.amountChanged.emit(value);
    });

    this.currencySelectionChanged$.subscribe((value) => {
      this.currencyChanged.emit(value);
      // console.log(value);
      // console.log("changed");
    });
  }

  // onCurrencySelectionChanged(event: MatSelectChange) {
  //   // this.currencySelectionChangedSource.next(event.value);
  // }

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
