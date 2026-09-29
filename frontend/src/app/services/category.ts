import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Category } from "../models/category.model";

@Injectable({ providedIn: "root" })
export class CategoryService {
  private http = inject(HttpClient);
  private backendUrl = "/api/categories";

  list() {
    return this.http.get<Category[]>(this.backendUrl);
  }

  listActive() {
    return this.http.get<Category[]>(this.backendUrl + "/active");
  }

  create(name: string) {
    return this.http.post<Category>(this.backendUrl, { name });
  }

  update(id: string, name: string) {
    return this.http.put<Category>(this.backendUrl + "/" + id, { name });
  }

  remove(id: string) {
    return this.http.delete<{ message: string }>(this.backendUrl + "/" + id);
  }

  addSubcategory(categoryId: string, name: string) {
    return this.http.post<Category>(this.backendUrl + "/" + categoryId + "/subcategories", { name });
  }

  removeSubcategory(categoryId: string, subId: string) {
    return this.http.delete<Category>(this.backendUrl + "/" + categoryId + "/subcategories/" + subId);
  }
}
