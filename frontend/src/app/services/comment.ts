import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Comment } from "../models/comment.model";

@Injectable({ providedIn: "root" })
export class CommentService {
  private http = inject(HttpClient);
  private backendUrl = "/api/comments";

  listForProduct(productId: string) {
    return this.http.get<Comment[]>(this.backendUrl + "/product/" + productId);
  }

  create(productId: string, text: string) {
    return this.http.post<Comment>(this.backendUrl, { productId, text });
  }
}
