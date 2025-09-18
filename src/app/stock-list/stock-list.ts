import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import { StocksService } from '../stocks.service';
import { PortfolioService } from '../core/services/portfolio.service';

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
    private snackBar: MatSnackBar,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadStocks() {
    this.loading = true;
    this.stocksService.getStocks(this.search).subscribe({
      next: (data: any[]) => {
        console.log("✅ Stocks from backend:", data);
        if (Array.isArray(data)) {
          this.stocks = data.slice(0, 50);
        } else {
          console.error("❌ Unexpected response format:", data);
          this.stocks = [];
        }
        this.startPolling();
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ Failed to load stocks:", err);
        this.loading = false;
      }
    });
  }

  startPolling() {
    this.pollSub?.unsubscribe();
    // refresh every 3 minutes
    this.pollSub = interval(180000).subscribe(() => this.loadStocks());
  }

  onSearchChange() {
    this.loadStocks();
  }

  selectStock(stock: any) {
    console.log("📌 Stock selected:", stock);
    this.stockSelected.emit(stock);
  }

  addToPortfolio(stock: any) {
    this.portfolioService.addToPortfolio(
      stock.symbol,
      stock.name || stock.symbol,
      stock.price || 0
    ).subscribe({
      next: () => {
        this.snackBar.open(`${stock.symbol} added to portfolio!`, 'Close', {
          duration: 2000
        });
      },
      error: (err) => {
        console.error('Error adding stock:', err);
        this.snackBar.open('Failed to add stock to portfolio.', 'Close', {
          duration: 2000
        });
      }
    });
  }
}
