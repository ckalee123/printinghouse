export interface RequestedItem {
  naziv: string;
  kategorija: string;
  kolicina: number;
}

export interface BidItem {
  naziv: string;
  productId: string;
  cenaPoKomadu: number;
  kolicinaDostupna: number;
}

export interface Bid {
  printerId: string;
  items: BidItem[];
  ukupnaCena: number;
  submittedAt: string;
}

export interface Procurement {
  _id: string;
  clientId: string;
  items: RequestedItem[];
  deadline: string;
  status: "open" | "closed";
  bids: Bid[];
  winningPrinterId: string | null;
  resultingOrderId: string | null;
  createdAt: string;
}
