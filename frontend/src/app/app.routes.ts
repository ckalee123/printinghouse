import { Routes } from "@angular/router";
import { Home } from "./public/home/home";
import { SearchResults } from "./public/search-results/search-results";
import { ProductDetails } from "./public/product-details/product-details";
import { NotFound } from "./shared/not-found/not-found";
import { Login } from "./auth/login/login";
import { AdminLogin } from "./auth/admin-login/admin-login";
import { RegisterClient } from "./auth/register-client/register-client";
import { RegisterPrinter } from "./auth/register-printer/register-printer";
import { ClientProfile } from "./client/profile/profile";
import { PrepareProduct } from "./client/prepare-product/prepare-product";
import { Cart } from "./client/cart/cart";
import { Archive } from "./client/archive/archive";
import { ClientProcurements } from "./client/procurements/procurements";
import { PrinterProfile } from "./printer/profile/profile";
import { PrinterProducts } from "./printer/products/products";
import { AddProduct } from "./printer/add-product/add-product";
import { UpdateQuantities } from "./printer/update-quantities/update-quantities";
import { UploadJson } from "./printer/upload-json/upload-json";
import { PrinterOrders } from "./printer/orders/orders";
import { PrinterProcurements } from "./printer/procurements/procurements";
import { AdminUsers } from "./admin/users/users";
import { PendingRequests } from "./admin/pending-requests/pending-requests";
import { AdminCategories } from "./admin/categories/categories";
import { AdminStatistics } from "./admin/statistics/statistics";
import { roleGuard } from "./core/guards/role.guard";

export const routes: Routes = [
  { path: "", component: Home },
  { path: "pretraga", component: SearchResults },
  { path: "proizvod/:id", component: ProductDetails },
  { path: "login", component: Login },
  { path: "admin/login", component: AdminLogin },
  { path: "registracija/klijent", component: RegisterClient },
  { path: "registracija/stampar", component: RegisterPrinter },

  { path: "klijent/profil", component: ClientProfile, canActivate: [roleGuard("client")] },
  { path: "klijent/priprema/:id", component: PrepareProduct, canActivate: [roleGuard("client")] },
  { path: "klijent/korpa", component: Cart, canActivate: [roleGuard("client")] },
  { path: "klijent/arhiva", component: Archive, canActivate: [roleGuard("client")] },
  { path: "klijent/javne-nabavke", component: ClientProcurements, canActivate: [roleGuard("client")] },

  { path: "stampar/profil", component: PrinterProfile, canActivate: [roleGuard("printer")] },
  { path: "stampar/proizvodi", component: PrinterProducts, canActivate: [roleGuard("printer")] },
  { path: "stampar/proizvodi/dodaj", component: AddProduct, canActivate: [roleGuard("printer")] },
  { path: "stampar/proizvodi/izmeni/:id", component: AddProduct, canActivate: [roleGuard("printer")] },
  { path: "stampar/kolicine", component: UpdateQuantities, canActivate: [roleGuard("printer")] },
  { path: "stampar/uvoz", component: UploadJson, canActivate: [roleGuard("printer")] },
  { path: "stampar/narudzbine", component: PrinterOrders, canActivate: [roleGuard("printer")] },
  { path: "stampar/licitacije", component: PrinterProcurements, canActivate: [roleGuard("printer")] },

  { path: "admin/korisnici", component: AdminUsers, canActivate: [roleGuard("admin")] },
  { path: "admin/zahtevi", component: PendingRequests, canActivate: [roleGuard("admin")] },
  { path: "admin/kategorije", component: AdminCategories, canActivate: [roleGuard("admin")] },
  { path: "admin/statistike", component: AdminStatistics, canActivate: [roleGuard("admin")] },

  { path: "**", component: NotFound }
];
