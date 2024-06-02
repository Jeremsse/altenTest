import { Component, OnDestroy, OnInit } from "@angular/core";
import { ControlType } from "app/shared/utils/crud-item-options/control-type.model";
import { CrudItemOptions } from "app/shared/utils/crud-item-options/crud-item-options.model";
import { ProductService } from "app/shared/utils/product/product.service";
import { Product } from "./product.model";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-products-admin",
  templateUrl: "./products-admin.component.html",
  styleUrls: ["./products-admin.component.scss"],
})
export class ProductsAdminComponent implements OnInit, OnDestroy {
  public products: Product[] = [];
  public config: CrudItemOptions[] = [];
  public totalRecords: number;
  public entity = Product;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
    this.config = this.getConfig();
  }

  getProducts(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products: Product[]) => {
        this.products = products;
        this.totalRecords = products.length;
      });
  }

  getConfig(): CrudItemOptions[] {
    return [
      {
        key: "id",
        label: "Id",
        controlType: ControlType.INPUT,
        type: "number",
        columnOptions: {
          default: false,
        },
      },
      {
        key: "code",
        label: "Code",
        controlType: ControlType.INPUT,
        type: "text",
        columnOptions: {
          default: true,
          sortable: true,
          filterable: true,
        },
      },
      {
        key: "name",
        label: "Name",
        controlType: ControlType.INPUT,
        type: "text",
        columnOptions: {
          default: true,
          sortable: true,
          filterable: true,
        },
      },
      {
        key: "description",
        label: "Description",
        controlType: ControlType.INPUT,
        type: "text",
        columnOptions: {
          default: false,
        },
      },
      {
        key: "price",
        label: "Price",
        controlType: ControlType.INPUT,
        type: "number",
        columnOptions: {
          default: false,
        },
      },
      {
        key: "quantity",
        label: "Quantity",
        controlType: ControlType.INPUT,
        type: "number",
        columnOptions: {
          default: false,
        },
      },
    ];
  }

  onEditedProductSave(product: Product): void {
    this.productService
      .saveProduct(product)
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products;
        this.getProducts();
      });
  }

  onDeleteProduct(ids: number[]): void {
    ids.forEach((id) => {
      this.productService
        .deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((products: Product[]) => {
          this.products = products;
          this.totalRecords = products.length;
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
