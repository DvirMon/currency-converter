import { inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";

export function differentCurrenciesValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const from = formGroup.get("from")?.value;
    const to = formGroup.get("to")?.value;

    return from && to && from === to ? { sameCurrency: true } : null;
  };
}
export class CurrencyFormService {
  #nfb = inject(NonNullableFormBuilder);

  createCurrencyConverterForm() {
    return this.#nfb.group(
      {
        from: this.#nfb.control("", [Validators.required]),
        to: this.#nfb.control("USD", [Validators.required]),
        // amount: this.#nfb.control("", [
        //   Validators.required,
        //   Validators.pattern(/^[1-9][0-9]*$/),
        // ]),
      },
      { validators: [differentCurrenciesValidator()] }
    );
  }

  getAmountControl(): FormControl<string> {
    return this.#nfb.control("1", [
      Validators.required,
      Validators.pattern(/^[1-9][0-9]*$/),
    ]);
  }
}
