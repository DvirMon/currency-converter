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

  createCurrencyConverterForm() {
    const defaultValues = this.#getFormDefaults();

    return this.#nfb.group(
      {
        from: this.#nfb.control(defaultValues.from || "", [
          Validators.required,
        ]),
        to: this.#nfb.control(defaultValues.to || "", [Validators.required]),
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

  #getFormDefaults(): {
    from: string;
    to: string;
  } {
    const formSessionData = this.#storageService.getFromSession<{
      from: string;
      to: string;
    }>(this.#sessionKeys.FORM_VALUES);

    return {
      from: formSessionData?.from || "",
      to: formSessionData?.to || "",
    };
  }
}
