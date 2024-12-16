import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
} from "@angular/core";
import { CurrencyConvertPipe } from "../../utils/currency-convert.pipe";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "app-currency-result",
  imports: [CurrencyConvertPipe, CurrencyPipe],
  templateUrl: "./currency-result.component.html",
  styleUrl: "./currency-result.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyResultComponent {
  to = input.required<string>();
  exchangeRate = input.required<number | null>();
  amount = input.required<number>();
}
