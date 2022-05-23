import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { MainTableService } from './main-table.service';

@Component({
    selector: 'app-main-table',
    templateUrl: './main-table.component.html',
    styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit {
    public cols: string[] = [];
    public products: Product[] = [];
    public display: boolean;

    public productDes: string = '';
    public currentStock: number;
    public safeStock: number;
    public price: number;

    public showSaleModal = true;
    public showReOrderModal = true;
    public showChangeModal = true;

    constructor(private tableService: MainTableService) { }

    public async ngOnInit(): Promise<void> {
        var totalProducts = await this.tableService.getAllStocks();
        this.mapAndSetProducts(totalProducts);
        this.cols = (await this.tableService.getSettings()).tableColumns;
    }

    public newProduct(): void {
        this.display = true;
    }

    public async getFullReport(): Promise<void> {
        var httpResponse = await this.tableService.GetFullReport();
        if (httpResponse == 200){
            alert('Report has been created!')
        }
    }

    public makeSales(selectedProduct: Product): void {
        this.tableService.selectedSaleProduct.next(selectedProduct);
        this.tableService.showSaleModal.next(true);
    }

    public reOrderProduct(selectedProduct: Product): void {
        this.tableService.selectedReOrderProduct.next(selectedProduct);
        this.tableService.showReOrderModal.next(true);
    }

    public changeProductDetails(selectedProduct: Product): void {
        this.tableService.selectedChangeProduct.next(selectedProduct);
        this.tableService.showChangeModal.next(true);
    }

    public async submitNewProduct(): Promise<void> {
        const isValid = this.areAllFilled(this.productDes, this.currentStock, this.safeStock, this.price);
        if (isValid) {
            const newProduct = {
                Description: this.productDes,
                CurrentStock: this.currentStock,
                SafeStock: this.safeStock,
                SoldStockTotal: 0,
                Price: this.price
            } as Product;

            var httpResponse = await this.tableService.createProduct(newProduct);
            if (httpResponse == 200){
                alert('New Product created!');
                var newTotalProducts = await this.tableService.getAllStocks();
                this.mapAndSetProducts(newTotalProducts);
                this.display = false;

                this.productDes = '';
                this.currentStock = null;
                this.safeStock = null;
                this.price = null;
            } else {
                alert('New Product created failed!');
            }
        }else{
            alert('All details are mandatory.');
        }
    }

    private areAllFilled(des: string, current: number, safeStock: number, price: number): boolean {
        return des != '' && current != undefined && safeStock != undefined && price != undefined;
    }

    private mapAndSetProducts(totalProducts: any[]): void {
        this.products = totalProducts.map(p => {
            return {
                ProductId: p.productId,
                Description: p.description,
                CurrentStock: p.currentStock,
                SafeStock: p.safeStock,
                SoldStockTotal: p.soldStockTotal,
                Price: p.price
            } as Product;
        });
    }
}
