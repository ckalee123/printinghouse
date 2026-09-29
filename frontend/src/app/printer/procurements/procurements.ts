import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProcurementService } from "../../services/procurement";
import { ProductService } from "../../services/product";
import { Procurement } from "../../models/procurement.model";
import { OwnerProduct } from "../../models/product.model";
import { Auth } from "../../core/services/auth";

interface BidDraft {
  [naziv: string]: { productId: string; cenaPoKomadu: number };
}

@Component({
  selector: "app-printer-procurements",
  imports: [FormsModule],
  templateUrl: "./procurements.html",
  styleUrl: "./procurements.css"
})
export class PrinterProcurements implements OnInit, OnDestroy {
  private procurementService = inject(ProcurementService);
  private productService = inject(ProductService);
  private auth = inject(Auth);

  open: Procurement[] = [];
  closed: Procurement[] = [];
  myProducts: OwnerProduct[] = [];
  drafts: Record<string, BidDraft> = {};
  errorMessages: Record<string, string> = {};
  successMessages: Record<string, string> = {};
  now = Date.now();
  private timer: any;

  ngOnInit() {
    this.productService.mine().subscribe((products) => (this.myProducts = products));
    this.load();
    this.timer = setInterval(() => (this.now = Date.now()), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  load() {
    this.procurementService.open().subscribe((data) => {
      this.open = data;
      data.forEach((p) => {
        if (!this.drafts[p._id]) {
          this.drafts[p._id] = {};
          p.items.forEach((item) => (this.drafts[p._id][item.naziv] = { productId: "", cenaPoKomadu: 0 }));
        }
      });
    });
    this.procurementService.mineAsPrinter().subscribe((data) => (this.closed = data.filter((p) => p.status === "closed")));
  }

  remainingSeconds(p: Procurement): number {
    return Math.max(0, Math.floor((new Date(p.deadline).getTime() - this.now) / 1000));
  }

  formatRemaining(p: Procurement): string {
    const s = this.remainingSeconds(p);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  alreadyBid(p: Procurement): boolean {
    const myId = this.auth.user()?.id;
    return p.bids.some((b) => b.printerId === myId);
  }

  submitBid(p: Procurement) {
    this.errorMessages[p._id] = "";
    const draft = this.drafts[p._id];
    const items = p.items.map((item) => ({
      naziv: item.naziv,
      productId: draft[item.naziv]?.productId,
      cenaPoKomadu: draft[item.naziv]?.cenaPoKomadu
    }));

    if (items.some((i) => !i.productId || i.cenaPoKomadu <= 0)) {
      this.errorMessages[p._id] = "Izaberite proizvod i unesite cenu za svaku traženu stavku";
      return;
    }

    this.procurementService.submitBid(p._id, items).subscribe({
      next: () => {
        this.successMessages[p._id] = "Ponuda je poslata";
        this.load();
      },
      error: (err) => (this.errorMessages[p._id] = err?.error?.message || "Greška pri slanju ponude")
    });
  }

  downloadReport(p: Procurement) {
    this.procurementService.downloadReport(p._id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `izvestaj-${p._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
