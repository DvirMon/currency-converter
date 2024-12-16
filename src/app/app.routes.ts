import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    // loadComponent: () =>
    //   import("./currency/feature/currency-dashboard/currency.component").then(
    //     (m) => m.CurrencyDashboardComponent
    //   ),
    loadComponent: () =>
      import("./currency-dashboard/currency-dashboard.component").then(
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
    path: "**",
    redirectTo: "/",
    pathMatch: "full",
  },
];
