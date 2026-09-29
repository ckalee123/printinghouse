import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthUser } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UserService {
  private http = inject(HttpClient);
  private backendUrl = "/api/users";

  me() {
    return this.http.get<AuthUser>(this.backendUrl + "/me");
  }

  updateMe(formData: FormData) {
    return this.http.put<AuthUser>(this.backendUrl + "/me", formData);
  }
}
