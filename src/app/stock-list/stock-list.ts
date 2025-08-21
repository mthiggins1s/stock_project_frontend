import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PriceStreamService } from '../core/services/price-stream.service'; // ✅ import live price service
import { Subscription } from 'rxjs';

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

  // ✅ New fields for live prices
  prices: { [symbol: string]: number } = {};
  private sub?: Subscription;

  constructor(
    private stocksService: StocksService,
    private snackBar: MatSnackBar,
    private priceStream: PriceStreamService // ✅ inject
  ) {}

  ngOnInit(): void {
    this.loadStocks();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    // ✅ Unsubscribe only from the first 10
    this.stocks.slice(0, 10).forEach(stock => {
      this.priceStream.unsubscribeFromSymbol(stock.symbol);
    });
  }

  loadStocks() {
    this.loading = true;
    this.stocksService.getStocks(this.search).subscribe(data => {
      data.forEach((stock: any) => {
        stock.added = this.addedStockSymbols.has(stock.symbol);
      });
      this.stocks = data;

      // ✅ Subscribe only to first 10
      this.stocks.slice(0, 10).forEach(stock => {
        this.priceStream.subscribeToSymbol(stock.symbol);
      });

      // ✅ Listen for live updates (attach once)
      if (!this.sub) {
        this.sub = this.priceStream.onPriceUpdate().subscribe(update => {
          if (this.stocks.slice(0, 10).some(s => s.symbol === update.symbol)) {
            this.prices[update.symbol] = update.price;
          }
        });
      }

      this.loading = false;
    }, () => { this.loading = false; });
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
