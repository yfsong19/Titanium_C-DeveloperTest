import { Component, OnInit } from '@angular/core';
import { Discount } from '../../models/discount.model';
import { Product } from '../../models/product.model';
import { MainTableService } from '../main-table.service';

@Component({
    selector: 'app-sale',
    templateUrl: './sale.component.html',
    styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {
    public soldNumber: number;
    public display = true;
    public selectedSaleProduct: Product = null;
    public discounts: Discount[] = [
        {discount: '5%', code: 0.05} as Discount,
        {discount: '10%', code: 0.1} as Discount,
        {discount: '15%', code: 0.15} as Discount
    ];
    public selectedDiscount: any;

    constructor(private tableService: MainTableService) { }

    ngOnInit(): void {
        this.tableService.showSaleModal.subscribe(value => {
            this.display = value;
        });

        this.tableService.selectedSaleProduct.subscribe(product => {
            this.selectedSaleProduct = product;
        });
    }

    public async sellProduct(): Promise<void> {
        if (this.soldNumber == undefined || this.soldNumber > this.selectedSaleProduct.CurrentStock){
            alert("The number is incorrect or we do not have enough stock!");
        } else {
            const possibleDiscount = this.selectedDiscount ? this.selectedDiscount.code : 0;
            const totalSale = this.selectedSaleProduct.Price * (1 - possibleDiscount) * this.soldNumber;
            this.selectedSaleProduct.CurrentStock -= this.soldNumber;
            this.selectedSaleProduct.SoldStockTotal += totalSale;
            var response = await this.tableService.updateProduct(this.selectedSaleProduct);
            if (response == 200){
                alert('Product sold ' + this.soldNumber + ' units!');
                this.tableService.showSaleModal.next(false);
                this.selectedDiscount = null;
                this.soldNumber = null;
            } else {
                alert('Product did not sell!');
            }
        }
    }
}
