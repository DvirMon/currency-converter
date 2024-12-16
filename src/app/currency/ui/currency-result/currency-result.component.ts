import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CurrencyConvertPipe } from "../../utils/currency-convert.pipe";

@Component({
  selector: "app-currency-result",
  imports: [CurrencyConvertPipe],
  templateUrl: "./currency-result.component.html",
  styleUrl: "./currency-result.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyResultComponent {
  rate = input.required<Record<string, number> | undefined>();
  to = input.required<string>();
  amount = input.required<number>();

  lastRate: number = 0;

  exchangeRate = computed(() => {
    const rate = this.rate();

    if (rate) {
      this.lastRate = rate[this.to()];
    }
    return this.lastRate;
  });
}
