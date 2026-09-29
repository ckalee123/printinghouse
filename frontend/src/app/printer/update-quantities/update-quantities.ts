import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product";
import { OwnerProduct } from "../../models/product.model";

@Component({
  selector: "app-update-quantities",
  imports: [FormsModule],
  templateUrl: "./update-quantities.html",
  styleUrl: "./update-quantities.css"
})
export class UpdateQuantities implements OnInit {
  private productService = inject(ProductService);

  products: OwnerProduct[] = [];
  loading = true;
  savedIds = new Set<string>();

  ngOnInit() {
    this.productService.mine().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  save(product: OwnerProduct) {
    this.productService.updateQuantity(product.id, product.kolicinaNaLageru).subscribe(() => {
      this.savedIds.add(product.id);
      setTimeout(() => this.savedIds.delete(product.id), 1500);
    });
  }
}
