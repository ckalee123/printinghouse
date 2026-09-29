import { Component, OnInit, inject } from "@angular/core";
import { OrderService } from "../../services/order";
import { Order } from "../../models/order.model";

@Component({
  selector: "app-printer-orders",
  imports: [],
  templateUrl: "./orders.html",
  styleUrl: "./orders.css"
})
export class PrinterOrders implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;

  ngOnInit() {
    this.load();
  }

  load() {
    this.orderService.forPrinter().subscribe((orders) => {
      this.orders = orders;
      this.loading = false;
    });
  }

  nextStatus(status: string): string | null {
    if (status === "naruceno") return "u_stampi";
    if (status === "u_stampi") return "isporuceno";
    return null;
  }

  advance(order: Order) {
    const next = this.nextStatus(order.status);
    if (!next) return;
    this.orderService.updateStatus(order._id, next).subscribe(() => this.load());
  }
}
