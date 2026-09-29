import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Auth } from "../../core/services/auth";

@Component({
  selector: "app-login",
  imports: [FormsModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.css"
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  username = "";
  password = "";
  errorMessage = "";
  loading = false;

  submit() {
    this.errorMessage = "";
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
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
