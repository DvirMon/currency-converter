import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CurrencyConvertPipe } from "../../../shared/pipes/currency-convert.pipe";

@Component({
  selector: "app-currency-result",
  imports: [CurrencyPipe, CurrencyConvertPipe],
  templateUrl: "./currency-result.component.html",
  styleUrl: "./currency-result.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyResultComponent {
  rate = input.required<Record<string, number> | undefined>();
  to = input.required<string>();
  amount = input.required<number>();

  exchangeRate = computed(() => {
    const rate = this.rate();
    return rate ? rate[this.to()] : 0;
  });
}
