import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MainTableService } from '../main-table.service';

@Component({
    selector: 'app-change',
    templateUrl: './change.component.html',
    styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {
    public display = true;
    public selectedChangeProduct: Product = null;
    public newPrice: number;
    public newSafeStock: number;
    constructor(private tableService: MainTableService) { }

    ngOnInit(): void {
        this.tableService.showChangeModal.subscribe(value => {
            this.display = value;
        });

        this.tableService.selectedChangeProduct.subscribe(product => {
            this.selectedChangeProduct = product;
        });
    }

    public async changeProduct(): Promise<void> {
        this.selectedChangeProduct.Price = this.newPrice ? this.newPrice : this.selectedChangeProduct.Price;
        this.selectedChangeProduct.SafeStock = this.newSafeStock? this.newSafeStock : this.selectedChangeProduct.SafeStock;
        var response = await this.tableService.updateProduct(this.selectedChangeProduct);
        if (response == 200){
            alert('Product has been updated!');
            this.tableService.showChangeModal.next(false);
            this.newSafeStock = null;
            this.newPrice = null;
        } else {
            alert('Product did not update!');
        }
    }
}
