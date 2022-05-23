import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MainTableService } from '../main-table.service';

@Component({
    selector: 'app-re-order',
    templateUrl: './re-order.component.html',
    styleUrls: ['./re-order.component.css']
})
export class ReOrderComponent implements OnInit {
    public display = true;
    public selectedReOrderProduct: Product = null;
    public reOrderNumber: number;

    private maxOrderMoney: number;
    constructor(private tableService: MainTableService) { }

    public async ngOnInit(): Promise<void> {
        this.maxOrderMoney = (await this.tableService.getSettings()).maxOrderMoney;
        this.tableService.showReOrderModal.subscribe(value => {
            this.display = value;
        });

        this.tableService.selectedReOrderProduct.subscribe(product => {
            this.selectedReOrderProduct = product;
        });
    }

    public async reOrderProduct(): Promise<void> {
        const currentPrice = this.selectedReOrderProduct.Price;
        const numberToReOrder = currentPrice > 100 ? 1 : this.maxOrderMoney / currentPrice;
        if (!this.reOrderNumber){
            alert('The reorder number is null!');
        } else if (this.reOrderNumber > numberToReOrder){
            alert('The reorder number is invalid! Should always order N units up to a maximum of $100 for that stock item.');
        }else{
            this.selectedReOrderProduct.CurrentStock += this.reOrderNumber;
            var response = await this.tableService.updateProduct(this.selectedReOrderProduct);
            if (response == 200){
                alert('Reordered ' + this.reOrderNumber + ' unit(s)!');
                this.tableService.showReOrderModal.next(false);
                this.reOrderNumber = null;
            } else {
                alert('Product did not reOrder!');
            }
        }
    }
}
