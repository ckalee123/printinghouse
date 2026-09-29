import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ProductService } from "../../services/product";
import { CartService } from "../../services/cart";
import { ProductExtendedDetail } from "../../models/product.model";

@Component({
  selector: "app-prepare-product",
  imports: [FormsModule, RouterLink],
  templateUrl: "./prepare-product.html",
  styleUrl: "./prepare-product.css"
})
export class PrepareProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: ProductExtendedDetail | null = null;
  loading = true;

  boja = "Bela";
  selectedUslugeIds: string[] = [];
  kolicina = 1;
  customizationType: "none" | "text" = "none";
  customizationText = "";
  errorMessage = "";

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")!;
    this.productService.getById(id).subscribe((p) => {
      this.product = p as ProductExtendedDetail;
      this.boja = this.product.dostupneBoje[0] || "Bela";
      this.loading = false;
    });
  }

  toggleUsluga(idUsluge: string) {
    if (this.selectedUslugeIds.includes(idUsluge)) {
      this.selectedUslugeIds = this.selectedUslugeIds.filter((i) => i !== idUsluge);
    } else {
      this.selectedUslugeIds = [...this.selectedUslugeIds, idUsluge];
    }
  }

  get cenaPoKomadu(): number {
    if (!this.product) return 0;
    const extra = this.product.uslugeStampe
      .filter((u) => this.selectedUslugeIds.includes(u.idUsluge))
      .reduce((sum, u) => sum + u.dodatnaCenaPoKomadu, 0);
    return this.product.jedinicnaCena + extra;
  }

  reset() {
    if (!this.product) return;
    this.boja = this.product.dostupneBoje[0] || "Bela";
    this.selectedUslugeIds = [];
    this.kolicina = 1;
    this.customizationType = "none";
    this.customizationText = "";
    this.errorMessage = "";
  }

  addToCart() {
    if (!this.product) return;
    this.errorMessage = "";

    if (this.kolicina < 1 || this.kolicina > this.product.kolicinaNaLageru) {
      this.errorMessage = "Nema dovoljno proizvoda trenutno na stanju";
      return;
    }

    const uslugeNazivi = this.product.uslugeStampe.filter((u) => this.selectedUslugeIds.includes(u.idUsluge)).map((u) => u.tipStampe);

    this.cartService.add({
      productId: this.product.id,
      naziv: this.product.naziv,
      kategorija: this.product.kategorija,
      printerId: this.product.printerId,
      nazivStamparije: this.product.nazivStamparije,
      grad: this.product.grad,
      slikaUrl: this.product.slikaUrl,
      cenaPoKomadu: this.cenaPoKomadu,
      kolicina: this.kolicina,
      boja: this.boja,
      uslugeIds: this.selectedUslugeIds,
      uslugeNazivi,
      customization:
        this.customizationType === "text"
          ? { type: "text", value: this.customizationText }
          : { type: null, value: null },
      kolicinaNaLageru: this.product.kolicinaNaLageru
    });

    this.router.navigate(["/klijent/korpa"]);
  }
}
