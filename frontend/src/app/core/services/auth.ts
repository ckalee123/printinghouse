import { Injectable, computed, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthUser, UserRole } from "../../models/user.model";

const TOKEN_KEY = "ph_token";
const USER_KEY = "ph_user";

@Injectable({ providedIn: "root" })
export class Auth {
  private backendUrl = "/api/auth";

  private _user = signal<AuthUser | null>(this.loadUser());
  user = this._user.asReadonly();
  isLoggedIn = computed(() => this._user() !== null);
  role = computed<UserRole | null>(() => this._user()?.role ?? null);

  constructor(private http: HttpClient) {}

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  registerClient(formData: FormData) {
    return this.http.post<{ message: string }>(this.backendUrl + "/register/client", formData);
  }

  registerPrinter(formData: FormData) {
    return this.http.post<{ message: string }>(this.backendUrl + "/register/printer", formData);
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(this.backendUrl + "/login", { username, password });
  }

  adminLogin(username: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>(this.backendUrl + "/admin-login", { username, password });
  }

  setSession(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  updateUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
  }
}
