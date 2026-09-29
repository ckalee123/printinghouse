import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ProductService } from "../../services/product";
import { CommentService } from "../../services/comment";
import { ProductExtendedDetail, ProductPublicDetail } from "../../models/product.model";
import { Comment } from "../../models/comment.model";
import { Auth } from "../../core/services/auth";
import { getCookie, setCookie } from "../../core/cookie.util";

function isExtended(p: ProductPublicDetail | ProductExtendedDetail): p is ProductExtendedDetail {
  return (p as ProductExtendedDetail).opis !== undefined;
}

@Component({
  selector: "app-product-details",
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: "./product-details.html",
  styleUrl: "./product-details.css"
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private commentService = inject(CommentService);
  auth = inject(Auth);

  product: ProductPublicDetail | ProductExtendedDetail | null = null;
  selectedImage = "";
  loading = true;

  comments: Comment[] = [];
  newComment = "";

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")!;
    this.productService.getById(id).subscribe((p) => {
      this.product = p;
      const cookieKey = "gallery_" + id;
      const remembered = getCookie(cookieKey);
      const allImages = [p.slikaUrl, ...p.dodatneSlike].filter(Boolean) as string[];
      this.selectedImage = remembered && allImages.includes(remembered) ? remembered : allImages[0] || "default_profile_image.jpg";
      this.loading = false;
    });
    this.loadComments(id);
  }

  loadComments(id: string) {
    this.commentService.listForProduct(id).subscribe((c) => (this.comments = c));
  }

  addComment() {
    if (!this.newComment.trim() || !this.product) return;
    this.commentService.create(this.product.id, this.newComment).subscribe(() => {
      this.newComment = "";
      this.loadComments(this.product!.id);
    });
  }

  get extended(): ProductExtendedDetail | null {
    return this.product && isExtended(this.product) ? this.product : null;
  }

  get galleryImages(): string[] {
    if (!this.product) return [];
    return [this.product.slikaUrl, ...this.product.dodatneSlike].filter(Boolean) as string[];
  }

  selectImage(img: string) {
    this.selectedImage = img;
    setCookie("gallery_" + this.product!.id, img, 30);
  }

  like() {
    this.productService.like(this.product!.id).subscribe((r) => {
      Object.assign(this.product!, r);
    });
  }

  dislike() {
    this.productService.dislike(this.product!.id).subscribe((r) => {
      Object.assign(this.product!, r);
    });
  }
}
