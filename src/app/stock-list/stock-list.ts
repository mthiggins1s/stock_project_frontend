import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TradingviewMiniComponent,
    MatSnackBarModule,
    MatToolbarModule,
  ]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  expanded: number | null = null;
  showChartFor: number | null = null;
  selectedSymbol: string | null = null;

  loading = true;
  placeholders = Array.from({length:8});

  constructor(
    private stocksService: StocksService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  loadStocks() {
    this.loading = true;
    this.stocksService.getStocks(this.search).subscribe(data => {
      data.forEach((stock: any) => {
        stock.added = this.addedStockSymbols.has(stock.symbol);
      });
      this.stocks = data;
      this.loading = false;
    }, () => { this.loading = false; });
  }

  onSearchChange() {
    this.loadStocks();
  }

  addToPortfolio(stock: any) {
  // Update UI state for "added"
  this.addedStockSymbols.add(stock.symbol);
  stock.added = true;

  // Save to localStorage
  let portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
  // Only add if not already in portfolio
  if (!portfolio.some((s: any) => s.symbol === stock.symbol)) {
    portfolio.push(stock);
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }

  // Show snackbar
  this.snackBar.open('Stock added to portfolio!', 'Close', {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'center',
  });
}


  // ---- CHIP BEHAVIOR ----
  trackStock(stock: any) {
    return stock.symbol;
  }

  expandChip(i: number) {
    this.expanded = this.expanded === i ? null : i;
    this.showChartFor = null;
    this.selectedSymbol = null;
  }

  showChart(i: number, symbol: string) {
    if (this.showChartFor === i && this.selectedSymbol === symbol) {
      this.showChartFor = null;
      this.selectedSymbol = null;
    } else {
      this.showChartFor = i;
      this.expanded = i;
      this.selectedSymbol = symbol;
    }
  }
}
