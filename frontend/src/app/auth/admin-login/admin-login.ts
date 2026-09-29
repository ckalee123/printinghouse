import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Auth } from "../../core/services/auth";

@Component({
  selector: "app-admin-login",
  imports: [FormsModule],
  templateUrl: "./admin-login.html",
  styleUrl: "./admin-login.css"
})
export class AdminLogin {
  private auth = inject(Auth);
  private router = inject(Router);

  username = "";
  password = "";
  errorMessage = "";
  loading = false;

  submit() {
    this.errorMessage = "";
    this.loading = true;
    this.auth.adminLogin(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        this.auth.setSession(res.token, res.user);
        this.router.navigate(["/"]);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Greška pri prijavljivanju";
      }
    });
  }
}
