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

export function differentCurrenciesValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const from = formGroup.get("from")?.value;
    const to = formGroup.get("to")?.value;

    return from && to && from === to ? { sameCurrency: true } : null;
  };
}
export class CurrencyFormService {
  #nfb = inject(NonNullableFormBuilder);

  #storageService = inject(StorageService);

  #sessionKeys = inject(SESSION_KEYS);

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
    const formSessionData = this.#storageService.getFromSession<{
      from: string;
      to: string;
      amount: number;
    }>(this.#sessionKeys.FORM_VALUES);

    return {
      from: formSessionData?.from || "",
      to: formSessionData?.to || "",
      amount: formSessionData?.amount || 1,
    };
  }
}
