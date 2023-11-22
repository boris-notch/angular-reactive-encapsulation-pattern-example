import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IProduct, Product } from '@app/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    TableModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ToastModule,
    ToolbarModule,
    InputNumberModule,
    MessagesModule,
  ],
  providers: [MessageService],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  showNewItemForm = false;
  products: Observable<IProduct[]> = new Product().fetchAllSelect$();
  clonedProduct: IProduct = new Product();
  newItem!: IProduct;

  onRowEditInit(product: Product): void {
    // Clone the currently edited product for later comparison
    this.clonedProduct.copyValuesFrom(product);
  }

  onRowEditSave(product: Product): void {
    product.updateSelect$().pipe(take(1)).subscribe();
  }

  onRowEditCancel(product: Product): void {
    product.copyValuesFrom(this.clonedProduct);
  }

  onRowDelete(product: Product): void {
    product.delete$().subscribe();
  }

  onAddNewSave(): void {
    this.newItem?.createSelect$().pipe(take(1)).subscribe();
    this.showNewItemForm = false;
  }

  // region *** Layout ***
  newItemForm(): void {
    this.newItem = new Product();
    this.showNewItemForm = true;
  }

  onAddNewCancel(): void {
    this.showNewItemForm = false;
  }

  // endregion
}
