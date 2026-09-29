export type OrderStatus = "naruceno" | "u_stampi" | "isporuceno" | "primljeno";

export interface OrderItem {
  productId: string;
  naziv: string;
  kolicina: number;
  boja: string | null;
  usluge: { idUsluge: string; tipStampe: string; dodatnaCenaPoKomadu: number }[];
  customization: { type: "text" | null; value: string | null };
  cenaPoKomadu: number;
  ukupno: number;
}

export interface Order {
  _id: string;
  clientId: string;
  printerId: string;
  nazivStamparije: string;
  grad: string;
  items: OrderItem[];
  ukupanIznos: number;
  status: OrderStatus;
  procurementId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArchiveRow {
  orderId: string;
  status: OrderStatus;
  createdAt: string;
  nazivStamparije: string;
  productId: string;
  naziv: string;
  kolicina: number;
}
