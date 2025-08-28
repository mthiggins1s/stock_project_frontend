import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StocksService } from '../stocks.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatToolbarModule,
  ]
})
export class StockListComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();
  loading = true;
  private pollSub?: Subscription;

  @Output() stockSelected = new EventEmitter<string>();

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

      this.stocks = data.slice(0, 50);
      this.startPolling();
      this.loading = false;
    }, () => { this.loading = false; });
  }

  startPolling() {
    this.pollSub?.unsubscribe();
    this.pollSub = interval(15 * 60 * 1000).subscribe(() => {
      this.stocks.forEach(stock => this.fetchQuote(stock.symbol));
    });
  }

  fetchQuote(symbol: string) {
    this.stocksService.getQuote(symbol).subscribe(q => {
      const stock = this.stocks.find(s => s.symbol === symbol);
      if (stock && q.price) {
        stock.price = q.price;
        stock.change = q.change;
        stock.change_percent = q.change_percent;
      }
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

    this.snackBar.open('Stock added to portfolio!', 'Close', { duration: 2000 });
  }

  selectStock(symbol: string) {
    this.stockSelected.emit(symbol);
  }
}
