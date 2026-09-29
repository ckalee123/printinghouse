import { HttpParams } from "@angular/common/http";

export function buildHttpParams(obj: Record<string, string | number | boolean | undefined | null>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== "") {
      params = params.set(key, String(value));
    }
  }
  return params;
}
