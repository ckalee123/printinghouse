import { Component, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductService } from "../../services/product";
import { OwnerProduct } from "../../models/product.model";

@Component({
  selector: "app-printer-products",
  imports: [RouterLink],
  templateUrl: "./products.html",
  styleUrl: "./products.css"
})
export class PrinterProducts implements OnInit {
  private productService = inject(ProductService);

  products: OwnerProduct[] = [];
  loading = true;

  ngOnInit() {
    this.productService.mine().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }
}
