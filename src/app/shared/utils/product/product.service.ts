import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "app/components/products/products-admin/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "assets/products.json";
  private products: Product[] = [];

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.products.length === 0) {
      return this.http.get<any>(this.productsUrl).pipe(
        map((products) => {
          this.products = products.data;
          return this.products;
        })
      );
    } else {
      return of(this.products);
    }
  }

  saveProduct(newProduct: Product): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => {
        const index = products.findIndex(
          (product) => product.id === newProduct.id
        );
        if (index === -1) {
          newProduct.id = this.generateId(products);
          products.push(newProduct);
        } else {
          products[index] = newProduct;
        }
        this.products = products;
        return products;
      })
    );
  }

  deleteProduct(id: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products) => {
        const index = products.findIndex((product) => product.id === id);
        if (index !== -1) {
          products.splice(index, 1);
        }
        this.products = products;
        return this.products;
      })
    );
  }

  private generateId(products: Product[]): number {
    return products.length > 0
      ? Math.max(...products.map((product) => product.id)) + 1
      : 1;
  }
}
