import { Component, OnInit, inject } from "@angular/core";
import { AdminService } from "../../services/admin";
import { AuthUser } from "../../models/user.model";

@Component({
  selector: "app-pending-requests",
  imports: [],
  templateUrl: "./pending-requests.html",
  styleUrl: "./pending-requests.css"
})
export class PendingRequests implements OnInit {
  private adminService = inject(AdminService);

  users: AuthUser[] = [];
  loading = true;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.adminService.listPending().subscribe((users) => {
      this.users = users;
      this.loading = false;
    });
  }

  approve(user: AuthUser) {
    this.adminService.approve(user.id).subscribe(() => this.load());
  }

  reject(user: AuthUser) {
    this.adminService.reject(user.id).subscribe(() => this.load());
  }
}
