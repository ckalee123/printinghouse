import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ProductService } from "../../services/product";
import { CategoryService } from "../../services/category";
import { HomeStats } from "../../models/product.model";
import { Category } from "../../models/category.model";

@Component({
  selector: "app-home",
  imports: [FormsModule, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.css"
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  stats: HomeStats | null = null;
  categories: Category[] = [];
  searchTerm = "";
  selectedCategory = "Sve kategorije";
  loading = true;

  ngOnInit() {
    this.productService.getStats().subscribe((s) => {
      this.stats = s;
      this.loading = false;
    });
    this.categoryService.listActive().subscribe((c) => (this.categories = c));
  }

  search() {
    this.router.navigate(["/pretraga"], {
      queryParams: { q: this.searchTerm || null, category: this.selectedCategory !== "Sve kategorije" ? this.selectedCategory : null }
    });
  }
}
