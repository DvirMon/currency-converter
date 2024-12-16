import { inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  TouchedChangeEvent,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { filter, iif, map, merge, of, startWith, switchMap, tap } from "rxjs";
import { CurrencyService } from "../../currency.service";

export function differentCurrenciesValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const from = formGroup.get("from")?.value;
    const to = formGroup.get("to")?.value;

    return from && to && from === to ? { sameCurrency: true } : null;
  };
}
export class CurrencyFormService {
  #nfb = inject(NonNullableFormBuilder);

  #currencyService = inject(CurrencyService);

  defaultValues = this.#getFormDefaults();
  createCurrencyConverterForm() {
    return this.#nfb.group(
      {
        from: this.#nfb.control(this.defaultValues.from, [Validators.required]),
        to: this.#nfb.control(this.defaultValues.to, [Validators.required]),
      },
      { validators: [differentCurrenciesValidator()] }
    );
  }

  getAmountControl(): FormControl<number> {
    return this.#nfb.control(this.defaultValues.amount, [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
    ]);
  }

  #getFormDefaults(): {
    from: string;
    to: string;
    amount: number;
  } {
    return this.#currencyService.getFormHistory();
  }

  setAmountErrorMessage(amountControl: FormControl<number>) {
    const amountTouchedEvent$ = amountControl.events.pipe(
      filter((event) => event instanceof TouchedChangeEvent),
      filter((event: TouchedChangeEvent) => event.touched)
    );

    const amountError$ = merge(
      amountControl.statusChanges,
      amountControl.valueChanges,
      amountTouchedEvent$
    ).pipe(map(() => this.#setErrorMessage(amountControl)));

    return toSignal(amountError$);
  }

  getSameCurrencyErrorMessage(
    currencyForm: FormGroup,
    amountControl: FormControl<number>
  ): Signal<string | undefined> {
    const hasSameCurrencyError$ = currencyForm.statusChanges.pipe(
      startWith(currencyForm.status),
      map(() => currencyForm.errors),
      map((errors) => errors && errors["sameCurrency"])
    );

    const sameCurrencyValidatorErrorMessage$ = hasSameCurrencyError$.pipe(
      switchMap((hasError) =>
        iif(
          () => hasError,
          of("The from and to currencies must be different").pipe(
            tap(() => amountControl.disable({ emitEvent: false }))
          ),
          of("").pipe(tap(() => amountControl.enable()))
        )
      )
    );

    return toSignal(sameCurrencyValidatorErrorMessage$);
  }

  #setErrorMessage(control: FormControl<unknown>) {
    if (control.hasError("required")) {
      return "Amount is required";
    }

    if (control.hasError("pattern")) {
      return "Amount must be positive";
    }

    return "";
  }
}
