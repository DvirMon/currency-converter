import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

@Component({
  selector: "app-currency-result",
  imports: [CurrencyPipe],
  templateUrl: "./currency-result.component.html",
  styleUrl: "./currency-result.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyResultComponent {
  rate = input<Record<string, number> | undefined>();
  to = input<string>();
  amount = input<number>(0);

  rateConverted = computed(() => {
    const rates = this.rate();
    const to = this.to();
    const amount = this.amount();

    if (rates && to) {
      return this.#convert(rates, to, amount);
    }

    return "0";
  });

  #convert(rates: Record<string, number>, to: string, amount: number): string {
    return (amount * rates[to]).toFixed(2);
  }
}
