export interface CartItem {
  lineId: string;
  productId: string;
  naziv: string;
  kategorija: string;
  printerId: string;
  nazivStamparije: string;
  grad: string;
  slikaUrl: string | null;
  cenaPoKomadu: number;
  kolicina: number;
  boja: string | null;
  uslugeIds: string[];
  uslugeNazivi: string[];
  customization: { type: "text" | null; value: string | null };
  kolicinaNaLageru: number;
}
