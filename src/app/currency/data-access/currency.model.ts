interface CurrencyItem {
    [code: string]: string; 
}
  

export interface ExchangeRatesResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>; 
}