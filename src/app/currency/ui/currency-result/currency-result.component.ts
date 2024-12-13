import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
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

  rateChanged = output<string>();

  rateConverted = computed(() => {
    const rates = this.rate();
    const to = this.to();
    const amount = this.amount();

    console.log(rates, to, amount);

    if (rates && to) {
      const result = this.#convert(rates, to, amount);
      this.#emitChange(result);
      return result;
    }

    return "0";
  });

  #convert(rates: Record<string, number>, to: string, amount: number): string {
    return (amount * rates[to]).toFixed(2);
  }

  #emitChange(result : string) {
    this.rateChanged.emit(result);
  }
}
