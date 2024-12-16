import { Component, inject } from "@angular/core";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { AsyncPipe } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-currency-dashboard",
  templateUrl: "./currency-dashboard.component.html",
  styleUrl: "./currency-dashboard.component.scss",
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class CurrencyDashboardComponent {
  card2 = { cols: 1, rows: 1 };
  card3 = { cols: 1, rows: 2 };
  card4 = { cols: 1, rows: 1 };

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Medium])
      .subscribe(({ matches }) => {
        if (matches) {
          // Adjust layout for small screens
          this.card2 = { cols: 2, rows: 1 };
          this.card3 = { cols: 2, rows: 1 };
          this.card4 = { cols: 2, rows: 1 };
        } else {
          // Adjust layout for larger screens
          this.card2 = { cols: 1, rows: 1 };
          this.card3 = { cols: 1, rows: 2 };
          this.card4 = { cols: 1, rows: 1 };
        }
      });
  }
}
