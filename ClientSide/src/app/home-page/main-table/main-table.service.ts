import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Product } from "../models/product.model";

@Injectable()
export class MainTableService{
    private readonly baseUrl = 'https://localhost:7285';

    public showSaleModal = new BehaviorSubject<boolean>(false);
    public selectedSaleProduct = new BehaviorSubject<Product>(null);

    public showReOrderModal = new BehaviorSubject<boolean>(false);
    public selectedReOrderProduct = new BehaviorSubject<Product>(null);

    public showChangeModal = new BehaviorSubject<boolean>(false);
    public selectedChangeProduct = new BehaviorSubject<Product>(null);

    constructor(private httpClient: HttpClient) { }

    public async getAllStocks(): Promise<any> {
        const route = '/api/Stocks';
        return await this.httpClient.get(this.baseUrl + route).toPromise();
    }

    public async createProduct(newProduct: Product): Promise<any> {
        const route = '/api/Stocks';
        const path = this.baseUrl + route;
        return await this.httpClient.post(path, newProduct).toPromise();
    }

    public async updateProduct(updatedProduct: Product): Promise<any> {
        const route = '/api/Stocks';
        const path = this.baseUrl + route;
        return await this.httpClient.put(path, updatedProduct).toPromise();
    }

    public async GetFullReport(): Promise<any> {
        const route = '/api/Stocks/StockReport';
        const path = this.baseUrl + route;
        return await this.httpClient.get(path).toPromise();
    }

    public async getSettings(): Promise<any> {
        const route = '/api/Stocks/Settings';
        return await this.httpClient.get(this.baseUrl + route).toPromise();
    }
}
