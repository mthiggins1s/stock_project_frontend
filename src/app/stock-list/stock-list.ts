import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';

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
export class StockListComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  expanded: number | null = null;
  showChartFor: number | null = null;
  selectedSymbol: string | null = null;

  loading = true;
  placeholders = Array.from({ length: 8 });

  // ✅ Prices (live + snapshot)
  prices: { [symbol: string]: number } = {};
  private pollSub?: Subscription;

  constructor(
    private stocksService: StocksService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadStocks() {
    this.loading = true;
    this.stocksService.getStocks(this.search).subscribe(data => {
      data.forEach((stock: any) => {
        stock.added = this.addedStockSymbols.has(stock.symbol);
      });

      // ✅ Only keep first 50
      this.stocks = data.slice(0, 50);

      // ✅ Snapshot prices for 11–50
      this.stocks.slice(10, 50).forEach(stock => {
        this.stocksService.getQuote(stock.symbol).subscribe(q => {
          if (q && q.c) {
            this.prices[stock.symbol] = q.c;
          }
        });
      });

      // ✅ Start polling first 10
      this.startPolling();

      this.loading = false;
    }, () => { this.loading = false; });
  }

  startPolling() {
    this.pollSub?.unsubscribe(); // clear old poller

    this.pollSub = interval(5000).subscribe(() => {
      this.stocks.slice(0, 10).forEach(stock => {
        this.stocksService.getQuote(stock.symbol).subscribe(q => {
          if (q && q.c) {
            this.prices[stock.symbol] = q.c; // "c" = current price
          }
        });
      });
    });
  }

  onSearchChange() {
    this.loadStocks();
  }

  addToPortfolio(stock: any) {
    this.addedStockSymbols.add(stock.symbol);
    stock.added = true;

    let portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    if (!portfolio.some((s: any) => s.symbol === stock.symbol)) {
      portfolio.push(stock);
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    }

    this.snackBar.open('Stock added to portfolio!', 'Close', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

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