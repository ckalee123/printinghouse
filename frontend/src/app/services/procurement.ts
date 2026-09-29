import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Procurement } from "../models/procurement.model";
import { CartItem } from "../models/cart-item.model";

@Injectable({ providedIn: "root" })
export class ProcurementService {
  private http = inject(HttpClient);
  private backendUrl = "/api/procurements";

  create(items: CartItem[]) {
    const payload = items.map((i) => ({ naziv: i.naziv, kategorija: i.kategorija, kolicina: i.kolicina }));
    return this.http.post<Procurement>(this.backendUrl, { items: payload });
  }

  mine() {
    return this.http.get<Procurement[]>(this.backendUrl + "/mine");
  }

  open() {
    return this.http.get<Procurement[]>(this.backendUrl + "/open");
  }

  mineAsPrinter() {
    return this.http.get<Procurement[]>(this.backendUrl + "/mine-printer");
  }

  submitBid(procurementId: string, items: { naziv: string; productId: string; cenaPoKomadu: number }[]) {
    return this.http.post<{ message: string }>(this.backendUrl + "/" + procurementId + "/bid", { items });
  }

  downloadReport(procurementId: string) {
    return this.http.get(this.backendUrl + "/" + procurementId + "/report", { responseType: "blob" });
  }
}
