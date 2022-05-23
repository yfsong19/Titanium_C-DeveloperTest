import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HomePageComponent } from './home-page.component';
import { MainTableComponent } from './main-table/main-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { SaleComponent } from './main-table/sale/sale.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReOrderComponent } from './main-table/re-order/re-order.component';
import { ChangeComponent } from './main-table/change/change.component';

@NgModule({
  declarations: [HomePageComponent, MainTableComponent, SaleComponent, ReOrderComponent, ChangeComponent],
  imports: [
    BrowserModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    DropdownModule
  ],
  exports: [HomePageComponent],
  providers: []
})
export class HomePageModule { }