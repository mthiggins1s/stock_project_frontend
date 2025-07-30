import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TradingviewMiniComponent,
    MatToolbar, // <-- keep this if you use <mat-toolbar>
  ]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  expanded: number | null = null;
  showChartFor: number | null = null;
  selectedSymbol: string | null = null;

  // FIX: Inject MatSnackBar here
  constructor(
    private stocksService: StocksService,
    private snackBar: MatSnackBar // <-- add this
  ) {}

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
    // ...your logic
    this.snackBar.open('Stock added to portfolio!', 'Close', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  // ---- CHIP BEHAVIOR ----
  trackStock(index: number, stock: any) {
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
