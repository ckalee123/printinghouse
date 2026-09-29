import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { OrderService } from "../../services/order";
import { ProductService } from "../../services/product";
import { CommentService } from "../../services/comment";
import { ArchiveRow } from "../../models/order.model";

@Component({
  selector: "app-archive",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./archive.html",
  styleUrl: "./archive.css"
})
export class Archive implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private commentService = inject(CommentService);

  rows: ArchiveRow[] = [];
  sortKey: "createdAt" | "naziv" | "kolicina" | "nazivStamparije" = "createdAt";
  sortAsc = false;
  commentDrafts: Record<string, string> = {};
  feedback: Record<string, string> = {};

  ngOnInit() {
    this.load();
  }

  load() {
    this.orderService.archive().subscribe((rows) => (this.rows = rows));
  }

  get sortedRows(): ArchiveRow[] {
    const dir = this.sortAsc ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const av = a[this.sortKey];
      const bv = b[this.sortKey];
      if (av === bv) return 0;
      return av > bv ? dir : -dir;
    });
  }

  sortBy(key: "createdAt" | "naziv" | "kolicina" | "nazivStamparije") {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
  }

  markReceived(row: ArchiveRow) {
    this.orderService.receive(row.orderId).subscribe(() => this.load());
  }

  like(row: ArchiveRow) {
    this.productService.like(row.productId).subscribe(() => (this.feedback[row.orderId + row.productId] = "Ocenjeno 👍"));
  }

  dislike(row: ArchiveRow) {
    this.productService.dislike(row.productId).subscribe(() => (this.feedback[row.orderId + row.productId] = "Ocenjeno 👎"));
  }

  submitComment(row: ArchiveRow) {
    const key = row.orderId + row.productId;
    const text = this.commentDrafts[key];
    if (!text || !text.trim()) return;
    this.commentService.create(row.productId, text).subscribe(() => {
      this.commentDrafts[key] = "";
      this.feedback[key] = "Komentar je dodat";
    });
  }
}
