import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HomeStats, OwnerProduct, ProductExtendedDetail, ProductListItem, ProductPublicDetail } from "../models/product.model";
import { buildHttpParams } from "../core/http-params.util";

@Injectable({ providedIn: "root" })
export class ProductService {
  private http = inject(HttpClient);
  private backendUrl = "/api/products";

  getStats() {
    return this.http.get<HomeStats>(this.backendUrl + "/public/stats");
  }

  search(params: { q?: string; category?: string; sort?: string; dir?: string }) {
    return this.http.get<ProductListItem[]>(this.backendUrl + "/search", { params: buildHttpParams(params) });
  }

  getById(id: string) {
    return this.http.get<ProductPublicDetail | ProductExtendedDetail>(this.backendUrl + "/" + id);
  }

  like(id: string) {
    return this.http.post<{ likeCount: number; dislikeCount: number }>(this.backendUrl + "/" + id + "/like", {});
  }

  dislike(id: string) {
    return this.http.post<{ likeCount: number; dislikeCount: number }>(this.backendUrl + "/" + id + "/dislike", {});
  }

  mine() {
    return this.http.get<OwnerProduct[]>(this.backendUrl + "/mine");
  }

  create(formData: FormData) {
    return this.http.post<OwnerProduct>(this.backendUrl, formData);
  }

  update(id: string, formData: FormData) {
    return this.http.put<OwnerProduct>(this.backendUrl + "/" + id, formData);
  }

  updateQuantity(id: string, kolicinaNaLageru: number) {
    return this.http.patch<OwnerProduct>(this.backendUrl + "/" + id + "/quantity", { kolicinaNaLageru });
  }

  importJson(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<{ message: string; products: OwnerProduct[] }>(this.backendUrl + "/import-json", formData);
  }

  setImages(id: string, formData: FormData) {
    return this.http.put<OwnerProduct>(this.backendUrl + "/" + id + "/images", formData);
  }
}
