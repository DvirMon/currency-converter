import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
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

  toValue = toSignal(this.toControl.valueChanges, {
    initialValue: this.toControl.value,
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

  formValue = computed(() => {
    return {
      from: this.fromValue(),
      to: this.toValue(),
    };
  });

  isFormValid$ = this.currencyConverterForm.statusChanges.pipe(
    map((status) => status === "VALID"),
    filter((value) => value)
  );

  formValues$ = toObservable(this.formValue);

  convertTrigger$ = combineLatest([this.isFormValid$, this.formValues$]).pipe(
    map(([valid, values]) => (valid ? values : undefined)),
    filter((value) => !!value)
  );

  // );
  // convertTrigger$ = this.isFormValid$.pipe(switchMap(() => this.formValues$));

  convertTrigger = toSignal(this.convertTrigger$);

  amountRateValue = toSignal(
    this.amountControl.valueChanges.pipe(
      map((value) => Number(value)),
      map((value) => (value > 0 ? value : 0))
    ),
    { initialValue: 0 }
  );

  constructor() {
    effect(() => {
      this.convertChanged.emit(this.convertTrigger());
    });

    effect(() => {
      this.amountChanged.emit(this.amountRateValue());
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
