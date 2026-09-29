import { Component, OnInit, inject } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration } from "chart.js";
import { StatsService } from "../../services/stats";

@Component({
  selector: "app-admin-statistics",
  imports: [BaseChartDirective],
  templateUrl: "./statistics.html",
  styleUrl: "./statistics.css"
})
export class AdminStatistics implements OnInit {
  private statsService = inject(StatsService);

  loading = true;

  barData: ChartConfiguration<"bar">["data"] = { labels: [], datasets: [{ label: "Promet (din)", data: [] }] };
  pieData: ChartConfiguration<"pie">["data"] = { labels: [], datasets: [{ data: [] }] };
  lineData: ChartConfiguration<"line">["data"] = { labels: [], datasets: [] };

  ngOnInit() {
    this.statsService.revenueByPrinter().subscribe((rows) => {
      this.barData = {
        labels: rows.map((r) => r.printer),
        datasets: [{ label: "Promet (din) - poslednja 3 meseca", data: rows.map((r) => r.total) }]
      };
    });

    this.statsService.mostOrderedProducts().subscribe((rows) => {
      this.pieData = {
        labels: rows.map((r) => `${r.naziv} (${r.procenat}%)`),
        datasets: [{ data: rows.map((r) => r.kolicina) }]
      };
    });

    this.statsService.productRatingOverTime().subscribe((res) => {
      this.lineData = {
        labels: res.labels,
        datasets: res.datasets.map((d) => ({ label: d.label, data: d.data, fill: false, tension: 0.2 }))
      };
      this.loading = false;
    });
  }
}
