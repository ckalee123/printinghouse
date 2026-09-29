import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthUser } from "../models/user.model";
import { buildHttpParams } from "../core/http-params.util";

@Injectable({ providedIn: "root" })
export class AdminService {
  private http = inject(HttpClient);
  private backendUrl = "/api/admin";

  listUsers(params: { role?: string; q?: string } = {}) {
    return this.http.get<AuthUser[]>(this.backendUrl + "/users", { params: buildHttpParams(params) });
  }

  updateUser(id: string, data: Partial<AuthUser>) {
    return this.http.put<AuthUser>(this.backendUrl + "/users/" + id, data);
  }

  deleteUser(id: string) {
    return this.http.delete<{ message: string }>(this.backendUrl + "/users/" + id);
  }

  listPending() {
    return this.http.get<AuthUser[]>(this.backendUrl + "/pending");
  }

  approve(id: string) {
    return this.http.post<AuthUser>(this.backendUrl + "/users/" + id + "/approve", {});
  }

  reject(id: string) {
    return this.http.post<AuthUser>(this.backendUrl + "/users/" + id + "/reject", {});
  }
}
