import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CategoryService } from "../../services/category";
import { Category } from "../../models/category.model";

@Component({
  selector: "app-admin-categories",
  imports: [FormsModule],
  templateUrl: "./categories.html",
  styleUrl: "./categories.css"
})
export class AdminCategories implements OnInit {
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  newCategoryName = "";
  newSubcategoryDrafts: Record<string, string> = {};

  ngOnInit() {
    this.load();
  }

  load() {
    this.categoryService.list().subscribe((c) => (this.categories = c));
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create(this.newCategoryName.trim()).subscribe(() => {
      this.newCategoryName = "";
      this.load();
    });
  }

  removeCategory(id: string) {
    this.categoryService.remove(id).subscribe(() => this.load());
  }

  addSubcategory(category: Category) {
    const name = this.newSubcategoryDrafts[category._id];
    if (!name || !name.trim()) return;
    this.categoryService.addSubcategory(category._id, name.trim()).subscribe(() => {
      this.newSubcategoryDrafts[category._id] = "";
      this.load();
    });
  }

  removeSubcategory(category: Category, subId: string) {
    this.categoryService.removeSubcategory(category._id, subId).subscribe(() => this.load());
  }
}
