import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service'; // Import your service!

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TradingviewMiniComponent]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  selectedIndex: number | null = null;
  selectedSymbol: string | null = null;

  constructor(private stocksService: StocksService) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.stocksService.getStocks(this.search).subscribe(data => {
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
    stock.added = true;
    this.addedStockSymbols.add(stock.symbol);
    alert('Stock has been added to your portfolio.');
  }

  showChart(i: number, symbol: string) {
  if (this.selectedSymbol === symbol) {
    this.selectedSymbol = null;
  } else {
    this.selectedSymbol = symbol;
    }
  }
}
