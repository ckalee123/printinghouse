import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export interface RevenueByPrinter {
  printer: string;
  total: number;
}

export interface MostOrderedProduct {
  naziv: string;
  kolicina: number;
  procenat: number;
}

export interface RatingOverTime {
  labels: string[];
  datasets: { label: string; data: number[] }[];
}

@Injectable({ providedIn: "root" })
export class StatsService {
  private http = inject(HttpClient);
  private backendUrl = "/api/stats";

  revenueByPrinter() {
    return this.http.get<RevenueByPrinter[]>(this.backendUrl + "/revenue-by-printer");
  }

  mostOrderedProducts() {
    return this.http.get<MostOrderedProduct[]>(this.backendUrl + "/most-ordered-products");
  }

  productRatingOverTime() {
    return this.http.get<RatingOverTime>(this.backendUrl + "/product-rating-over-time");
  }
}
