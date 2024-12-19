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
import {
  filter,
  iif,
  map,
  merge,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from "rxjs";
import { HistoryService } from "../../data-access/history.service";

export function differentCurrenciesValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const from = formGroup.get("from")?.value;
    const to = formGroup.get("to")?.value;

    return from && to && from === to ? { sameCurrency: true } : null;
  };
}
export class CurrencyFormService {
  #nfb = inject(NonNullableFormBuilder);

  #historyService = inject(HistoryService);

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

  getAmountControl(): FormControl<string> {
    return this.#nfb.control((this.defaultValues.amount), [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
    ]);
  }

  #getFormDefaults(): {
    from: string;
    to: string;
    amount: string;
  } {
    return this.#historyService.getSessionFormHistory();
  }

  setAmountErrorMessage(amountControl: FormControl<unknown>) {
    const amountTouchedEvent$ = amountControl.events.pipe(
      filter((event) => event instanceof TouchedChangeEvent),
      filter((event: TouchedChangeEvent) => event.touched)
    );

    const amountErrorMessage$ = merge(
      amountControl.statusChanges,
      amountControl.valueChanges,
      amountTouchedEvent$
    ).pipe(map(() => this.#setErrorMessage(amountControl)));

    return toSignal(amountErrorMessage$);
  }

  getSameCurrencyErrorMessage(
    currencyForm: FormGroup<{
      to: FormControl<string>;
      from: FormControl<string>;
    }>,
    amountControl: FormControl<string>
  ): Signal<string | undefined> {
    const hasSameCurrencyError$ = merge(
      currencyForm.valueChanges,
      currencyForm.statusChanges
    ).pipe(
      map(() => currencyForm.errors),
      map((errors) => errors && errors["sameCurrency"])
    );

    const sameCurrencyValidatorErrorMessage$ = hasSameCurrencyError$.pipe(
      switchMap((hasError) =>
        iif(
          () => hasError,
          of("The from and to currencies must be different").pipe(
            tap(() => {
              currencyForm.controls.from.setErrors(
                { sameCurrency: true },
                { emitEvent: false }
              );
              currencyForm.controls.from.markAsTouched({ emitEvent: false });
            }),
            tap(() => amountControl.disable({ emitEvent: false }))
          ),
          of("").pipe(
            tap(() => amountControl.enable({ emitEvent: false })),
            tap(() =>
              currencyForm.controls.from.updateValueAndValidity({
                emitEvent: false,
              })
            )
          )
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
