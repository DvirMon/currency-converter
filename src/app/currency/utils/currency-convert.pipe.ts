import { Pipe, PipeTransform } from "@angular/core";
import e from "express";

@Pipe({
  name: "currencyConvert",
})
export class CurrencyConvertPipe implements PipeTransform {
  transform(amount: number, exchangeRate: number | null): string {
   

    console.log(exchangeRate, "exchangeRate");
    console.log(amount, "amount");

    if (amount <= 0 || !exchangeRate) {
      return "0.00";
    }
    return (amount * (Number(exchangeRate) ?? 0)).toFixed(2);
  }
}
