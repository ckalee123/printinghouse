import { Injectable, computed, signal } from "@angular/core";
import { CartItem } from "../models/cart-item.model";

const CART_KEY = "ph_cart";

@Injectable({ providedIn: "root" })
export class CartService {
  private _items = signal<CartItem[]>(this.load());
  items = this._items.asReadonly();

  count = computed(() => this._items().reduce((sum, i) => sum + i.kolicina, 0));

  groupedByPrinter = computed(() => {
    const groups = new Map<string, CartItem[]>();
    for (const item of this._items()) {
      if (!groups.has(item.printerId)) groups.set(item.printerId, []);
      groups.get(item.printerId)!.push(item);
    }
    return Array.from(groups.entries()).map(([printerId, items]) => ({
      printerId,
      nazivStamparije: items[0].nazivStamparije,
      items,
      ukupno: items.reduce((sum, i) => sum + i.cenaPoKomadu * i.kolicina, 0)
    }));
  });

  grandTotal = computed(() => this._items().reduce((sum, i) => sum + i.cenaPoKomadu * i.kolicina, 0));

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist() {
    localStorage.setItem(CART_KEY, JSON.stringify(this._items()));
  }

  add(item: Omit<CartItem, "lineId">) {
    const lineId = crypto.randomUUID();
    this._items.update((items) => [...items, { ...item, lineId }]);
    this.persist();
  }

  remove(lineId: string) {
    this._items.update((items) => items.filter((i) => i.lineId !== lineId));
    this.persist();
  }

  clear() {
    this._items.set([]);
    this.persist();
  }
}
