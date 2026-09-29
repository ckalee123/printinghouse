import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { Auth } from "../../core/services/auth";
import { CartService } from "../../services/cart";

@Component({
  selector: "app-header",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./header.html",
  styleUrl: "./header.css"
})
export class Header {
  auth = inject(Auth);
  cart = inject(CartService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(["/"]);
  }
}
