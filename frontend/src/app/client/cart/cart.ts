import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../services/cart";
import { OrderService } from "../../services/order";
import { ProcurementService } from "../../services/procurement";
import { Auth } from "../../core/services/auth";

@Component({
  selector: "app-cart",
  imports: [RouterLink],
  templateUrl: "./cart.html",
  styleUrl: "./cart.css"
})
export class Cart {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private procurementService = inject(ProcurementService);
  private auth = inject(Auth);
  private router = inject(Router);

  loading = false;
  errorMessage = "";
  successMessage = "";
  isCompany = this.auth.user()?.isCompany ?? false;

  confirm() {
    this.errorMessage = "";
    this.successMessage = "";
    this.loading = true;

    if (this.isCompany) {
      this.procurementService.create(this.cart.items()).subscribe({
        next: () => {
          this.loading = false;
          this.cart.clear();
          this.successMessage = "Poziv za javnu nabavku je uspešno poslat svim štamparijama. Rok za ponude je 10 minuta.";
          setTimeout(() => this.router.navigate(["/klijent/javne-nabavke"]), 2000);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || "Greška pri kreiranju javne nabavke";
        }
      });
    } else {
      this.orderService.checkout(this.cart.items()).subscribe({
        next: (res) => {
          this.loading = false;
          this.cart.clear();
          this.successMessage = `Kreirano je ${res.orders.length} faktura. Faktura(e) je poslata na vaš e-mejl.`;
          setTimeout(() => this.router.navigate(["/klijent/profil"]), 2500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || "Greška pri naručivanju";
        }
      });
    }
  }
}
