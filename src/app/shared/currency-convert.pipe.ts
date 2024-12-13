import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "currencyConvert",
})
export class CurrencyConvertPipe implements PipeTransform {
  transform(amount: number, exchangeRate: number | undefined): string {
    if (amount <= 0) {
      return "0.00"; 
    }
    return (amount * (exchangeRate ?? 0)).toFixed(2);
  }
}
