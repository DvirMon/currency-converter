import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CurrencyService } from "./data-access/currency.service";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-currency",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    JsonPipe
  ],
  templateUrl: "./currency.component.html",
  styleUrl: "./currency.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
  #currencyService = inject(CurrencyService);


  currencyResource = this.#currencyService.getCurrencyList();
}
