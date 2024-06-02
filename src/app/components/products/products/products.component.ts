import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ProductService } from "app/shared/utils/product/product.service";
import { SelectItem } from "primeng/api";
import { Subject, takeUntil } from "rxjs";
import { Product } from "../products-admin/product.model";
import { SnackbarService } from "app/shared/utils/snackbar/snackbar.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild("listItemTemplate", { static: true })
  public listItemTemplate: TemplateRef<unknown>;
  @ViewChild("gridItemTemplate", { static: true })
  public gridItemTemplate: TemplateRef<unknown>;

  public products: Product[] = [];
  public totalRecords: number;
  public sortOptions: SelectItem[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly productService: ProductService,
    private readonly snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.initializeSortOptions();
  }

  private getProducts() {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products: Product[]) => {
        this.products = products;
        this.totalRecords = products.length;
      });
  }

  private initializeSortOptions() {
    this.sortOptions = [
      { label: "Name", value: "asc-name" },
      { label: "Price", value: "asc-price" },
    ];
  }

  public addProduct() {
    this.snackbarService.displaySuccess();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
