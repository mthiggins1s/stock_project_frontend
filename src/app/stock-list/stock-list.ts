import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'], // <-- This makes your CSS work!
  imports: [CommonModule, FormsModule]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';

  constructor(private stocksService: StocksService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.stocksService.getStocks(this.search).subscribe(data => {
      this.stocks = data;
    });
  }

  onSearchChange() {
    this.loadStocks();
  }
}
