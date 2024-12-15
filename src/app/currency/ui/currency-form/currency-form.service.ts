import { inject } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { SESSION_KEYS } from "../../../shared/services/storage.keys";
import { StorageService } from "../../../shared/services/storage.service";
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
}
