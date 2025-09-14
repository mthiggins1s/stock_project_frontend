import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import { StocksService } from '../stocks.service';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  imports: [CommonModule, FormsModule, MatSnackBarModule]
})
export class StockListComponent implements OnInit, OnDestroy {
  stocks: any[] = [];
  search: string = '';
  loading = true;
  private pollSub?: Subscription;

  @Output() stockSelected = new EventEmitter<any>();

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
    this.stocksService.getStocks(this.search).subscribe(
      data => {
        this.stocks = data.slice(0, 50); // show first 50
        this.startPolling();
        this.loading = false;
      },
      () => (this.loading = false)
    );
  }

  startPolling() {
    this.pollSub?.unsubscribe();
    // refresh every 10 seconds (since you have unlimited calls)
    this.pollSub = interval(180000).subscribe(() => this.loadStocks());
  }

  onSearchChange() {
    this.loadStocks();
  }

  selectStock(stock: any) {
    this.stockSelected.emit(stock);
  }

  addToPortfolio(stock: any) {
    let portfolio = JSON.parse(localStorage.getItem('portfolio') || '[]');
    if (!portfolio.some((s: any) => s.symbol === stock.symbol)) {
      portfolio.push(stock);
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
      this.snackBar.open('Stock added to portfolio!', 'Close', {
        duration: 2000
      });
    }
  }
}
