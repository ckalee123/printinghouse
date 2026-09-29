import { Component, inject } from "@angular/core";
import { ProductService } from "../../services/product";
import { OwnerProduct } from "../../models/product.model";

@Component({
  selector: "app-upload-json",
  imports: [],
  templateUrl: "./upload-json.html",
  styleUrl: "./upload-json.css"
})
export class UploadJson {
  private productService = inject(ProductService);

  selectedFile: File | null = null;
  importedProducts: OwnerProduct[] = [];
  message = "";
  errorMessage = "";
  uploading = false;
  imageSavedIds = new Set<string>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  upload() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.errorMessage = "";
    this.productService.importJson(this.selectedFile).subscribe({
      next: (res) => {
        this.uploading = false;
        this.message = res.message;
        this.importedProducts = res.products;
      },
      error: (err) => {
        this.uploading = false;
        this.errorMessage = err?.error?.message || "Greška pri uvozu fajla";
      }
    });
  }

  onProductImageSelected(product: OwnerProduct, event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("slika", file);
    this.productService.setImages(product.id, formData).subscribe((updated) => {
      product.slikaUrl = updated.slikaUrl;
      this.imageSavedIds.add(product.id);
    });
  }
}
