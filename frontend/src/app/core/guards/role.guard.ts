import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../services/auth";
import { UserRole } from "../../models/user.model";

export function roleGuard(...allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    if (!auth.isLoggedIn()) {
      return router.parseUrl("/login");
    }
    if (!allowedRoles.includes(auth.role() as UserRole)) {
      return router.parseUrl("/");
    }
    return true;
  };
}
