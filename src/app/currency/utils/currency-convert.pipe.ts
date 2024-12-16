import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "currencyConvert",
})
export class CurrencyConvertPipe implements PipeTransform {
  transform(amount: number, exchangeRate: unknown): string {
    if (amount <= 0) {
      return "0.00"; 
    }
    return (amount * (Number(exchangeRate) ?? 0)).toFixed(2);
  }
}
