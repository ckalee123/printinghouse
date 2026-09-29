import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminService } from "../../services/admin";
import { AuthUser } from "../../models/user.model";

@Component({
  selector: "app-admin-users",
  imports: [FormsModule],
  templateUrl: "./users.html",
  styleUrl: "./users.css"
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);

  users: AuthUser[] = [];
  loading = true;
  search = "";
  roleFilter = "";
  editingId: string | null = null;
  editDraft: Partial<AuthUser> = {};

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.adminService.listUsers({ role: this.roleFilter || undefined, q: this.search || undefined }).subscribe((users) => {
      this.users = users;
      this.loading = false;
    });
  }

  startEdit(user: AuthUser) {
    this.editingId = user.id;
    this.editDraft = { firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(user: AuthUser) {
    this.adminService.updateUser(user.id, this.editDraft).subscribe(() => {
      this.editingId = null;
      this.load();
    });
  }

  remove(user: AuthUser) {
    this.adminService.deleteUser(user.id).subscribe(() => this.load());
  }
}
