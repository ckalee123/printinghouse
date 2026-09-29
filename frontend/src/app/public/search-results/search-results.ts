import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProductService } from "../../services/product";
import { CategoryService } from "../../services/category";
import { ProductListItem } from "../../models/product.model";
import { Category } from "../../models/category.model";

@Component({
  selector: "app-search-results",
  imports: [FormsModule, RouterLink],
  templateUrl: "./search-results.html",
  styleUrl: "./search-results.css"
})
export class SearchResults implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);

  searchTerm = "";
  selectedCategory = "Sve kategorije";
  sortDir: "asc" | "desc" | null = null;
  categories: Category[] = [];
  results: ProductListItem[] = [];
  loading = true;

  ngOnInit() {
    this.categoryService.listActive().subscribe((c) => (this.categories = c));

    this.route.queryParamMap.subscribe((params) => {
      this.searchTerm = params.get("q") || "";
      this.selectedCategory = params.get("category") || "Sve kategorije";
      this.runSearch();
    });
  }

  runSearch() {
    this.loading = true;
    this.productService
      .search({
        q: this.searchTerm || undefined,
        category: this.selectedCategory !== "Sve kategorije" ? this.selectedCategory : undefined,
        sort: this.sortDir ? "naziv" : undefined,
        dir: this.sortDir || undefined
      })
      .subscribe((res) => {
        this.results = res;
        this.loading = false;
      });
  }

  toggleSortByName() {
    this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
    this.runSearch();
  }
}
