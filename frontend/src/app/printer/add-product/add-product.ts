import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../services/product";
import { CategoryService } from "../../services/category";
import { Category } from "../../models/category.model";
import { PrintingService } from "../../models/product.model";

@Component({
  selector: "app-add-product",
  imports: [FormsModule],
  templateUrl: "./add-product.html",
  styleUrl: "./add-product.css"
})
export class AddProduct implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  editId: string | null = null;
  categories: Category[] = [];

  sifra = "";
  naziv = "";
  opis = "";
  kategorija = "";
  potkategorija = "";
  jedinicnaCena = 0;
  kolicinaNaLageru = 0;
  dostupneBojeText = "Bela";
  usluge: PrintingService[] = [];

  slikaFile: File | null = null;
  dodatneSlikeFiles: File[] = [];

  errorMessage = "";
  successMessage = "";
  saving = false;

  ngOnInit() {
    this.categoryService.list().subscribe((c) => (this.categories = c));

    this.editId = this.route.snapshot.paramMap.get("id");
    if (this.editId) {
      this.productService.mine().subscribe((products) => {
        const existing = products.find((p) => p.id === this.editId);
        if (existing) {
          this.sifra = existing.sifra || "";
          this.naziv = existing.naziv;
          this.opis = existing.opis;
          this.kategorija = existing.kategorija;
          this.potkategorija = existing.potkategorija;
          this.jedinicnaCena = existing.jedinicnaCena;
          this.kolicinaNaLageru = existing.kolicinaNaLageru;
          this.dostupneBojeText = existing.dostupneBoje.join(", ");
          this.usluge = existing.uslugeStampe;
        }
      });
    }
  }

  get subcategories() {
    return this.categories.find((c) => c.name === this.kategorija)?.subcategories || [];
  }

  addUsluga() {
    this.usluge = [
      ...this.usluge,
      { idUsluge: "USL-" + Date.now(), tipStampe: "", dodatnaCenaPoKomadu: 0, maxSirinaMm: null, maxVisinaMm: null }
    ];
  }

  removeUsluga(index: number) {
    this.usluge = this.usluge.filter((_, i) => i !== index);
  }

  onSlikaSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.slikaFile = input.files?.[0] || null;
  }

  onDodatneSlikeSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dodatneSlikeFiles = input.files ? Array.from(input.files).slice(0, 3) : [];
  }

  submit() {
    this.errorMessage = "";
    this.successMessage = "";

    if (!this.naziv || !this.kategorija || !this.potkategorija || this.jedinicnaCena < 0) {
      this.errorMessage = "Popunite sva obavezna polja";
      return;
    }

    const formData = new FormData();
    formData.append("sifra", this.sifra);
    formData.append("naziv", this.naziv);
    formData.append("opis", this.opis);
    formData.append("kategorija", this.kategorija);
    formData.append("potkategorija", this.potkategorija);
    formData.append("jedinicnaCena", String(this.jedinicnaCena));
    formData.append("kolicinaNaLageru", String(this.kolicinaNaLageru));
    formData.append(
      "dostupneBoje",
      JSON.stringify(
        this.dostupneBojeText
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean)
      )
    );
    formData.append("uslugeStampe", JSON.stringify(this.usluge));
    if (this.slikaFile) formData.append("slika", this.slikaFile);
    this.dodatneSlikeFiles.forEach((f) => formData.append("dodatneSlike", f));

    this.saving = true;
    const request = this.editId ? this.productService.update(this.editId, formData) : this.productService.create(formData);
    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = "Proizvod je sačuvan.";
        setTimeout(() => this.router.navigate(["/stampar/proizvodi"]), 1200);
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || "Greška pri čuvanju proizvoda";
      }
    });
  }
}
