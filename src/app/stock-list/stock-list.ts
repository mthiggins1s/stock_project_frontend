import { Component, OnInit } from '@angular/core';
import { StocksService } from '../stocks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  imports: [CommonModule, FormsModule]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  constructor(
    private stocksService: StocksService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.stocksService.getStocks(this.search).subscribe(data => {
      // Optionally: mark stocks as 'added' for UI
      data.forEach((stock: any) => {
        stock.added = this.addedStockSymbols.has(stock.symbol);
      });
      this.stocks = data;
    });
  }

  onSearchChange() {
    this.loadStocks();
  }

  addToPortfolio(stock: any) {
    this.http.post('/portfolio_stocks', { symbol: stock.symbol }).subscribe({
      next: () => {
        stock.added = true;
        this.addedStockSymbols.add(stock.symbol);
      },
      error: () => {
        alert('Could not add to portfolio.');
      }
    });
  }
}
