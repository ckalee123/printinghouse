export interface ProductListItem {
  id: string;
  naziv: string;
  kategorija: string;
  potkategorija: string;
  slikaUrl: string | null;
  nazivStamparije: string;
  grad: string;
  likeCount: number;
  dislikeCount: number;
}

export interface PrintingService {
  idUsluge: string;
  tipStampe: string;
  dodatnaCenaPoKomadu: number;
  maxSirinaMm: number | null;
  maxVisinaMm: number | null;
}

export interface ProductPublicDetail {
  id: string;
  naziv: string;
  kategorija: string;
  nazivStamparije: string;
  grad: string;
  slikaUrl: string | null;
  dodatneSlike: string[];
  likeCount: number;
  dislikeCount: number;
}

export interface ProductExtendedDetail extends ProductPublicDetail {
  printerId: string;
  opis: string;
  jedinicnaCena: number;
  kolicinaNaLageru: number;
  dostupneBoje: string[];
  uslugeStampe: PrintingService[];
}

export interface OwnerProduct {
  id: string;
  printerId: string;
  sifra: string | null;
  naziv: string;
  opis: string;
  kategorija: string;
  potkategorija: string;
  jedinicnaCena: number;
  kolicinaNaLageru: number;
  dostupneBoje: string[];
  slikaUrl: string | null;
  dodatneSlike: string[];
  uslugeStampe: PrintingService[];
  likeCount: number;
  dislikeCount: number;
}

export interface HomeStats {
  printerCount: number;
  top5: ProductListItem[];
}
