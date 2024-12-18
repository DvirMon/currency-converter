import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () =>
      import(
        "./currency/feature/currency-dashboard/currency-dashboard.component"
      ).then((m) => m.CurrencyDashboardComponent),
  },

  {
    path: "original",
    loadComponent: () =>
      import("./currency/feature/currency-dashboard-original/currency.component").then(
        (m) => m.CurrencyDashboardComponent
      ),
  },

  {
    path: "history",
    loadComponent: () =>
      import("./currency/feature/currency-history/history.component").then(
        (m) => m.CurrencyHistoryComponent
      ),
  },

  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
];
