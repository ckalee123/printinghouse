import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProcurementService } from "../../services/procurement";
import { Procurement } from "../../models/procurement.model";

@Component({
  selector: "app-client-procurements",
  imports: [RouterLink],
  templateUrl: "./procurements.html",
  styleUrl: "./procurements.css"
})
export class ClientProcurements implements OnInit, OnDestroy {
  private procurementService = inject(ProcurementService);

  procurements: Procurement[] = [];
  now = Date.now();
  private timer: any;

  ngOnInit() {
    this.load();
    this.timer = setInterval(() => (this.now = Date.now()), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  load() {
    this.procurementService.mine().subscribe((data) => (this.procurements = data));
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
}
