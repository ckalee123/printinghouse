import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ArchiveRow, Order } from "../models/order.model";
import { CartItem } from "../models/cart-item.model";

@Injectable({ providedIn: "root" })
export class OrderService {
  private http = inject(HttpClient);
  private backendUrl = "/api/orders";

  checkout(items: CartItem[]) {
    const payload = items.map((i) => ({
      productId: i.productId,
      kolicina: i.kolicina,
      boja: i.boja,
      uslugeIds: i.uslugeIds,
      customization: i.customization
    }));
    return this.http.post<{ orders: Order[] }>(this.backendUrl + "/checkout", { items: payload });
  }

  mine() {
    return this.http.get<Order[]>(this.backendUrl + "/mine");
  }

  cancel(orderId: string) {
    return this.http.post<{ message: string }>(this.backendUrl + "/" + orderId + "/cancel", {});
  }

  receive(orderId: string) {
    return this.http.post<Order>(this.backendUrl + "/" + orderId + "/receive", {});
  }

  archive() {
    return this.http.get<ArchiveRow[]>(this.backendUrl + "/archive");
  }

  forPrinter() {
    return this.http.get<Order[]>(this.backendUrl + "/for-printer");
  }

  updateStatus(orderId: string, status: string) {
    return this.http.patch<Order>(this.backendUrl + "/" + orderId + "/status", { status });
  }
}
