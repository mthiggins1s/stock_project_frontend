import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingviewMiniComponent } from '../tradingview-mini/tradingview-mini';
import { StocksService } from '../stocks.service';
import { MatSidenavModule } from '@angular/material/sidenav'; // <-- Add this line!
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.html',
  styleUrls: ['./stock-list.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TradingviewMiniComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ]
})
export class StockListComponent implements OnInit {
  stocks: any[] = [];
  search: string = '';
  addedStockSymbols: Set<string> = new Set();

  expanded: number | null = null;
  showChartFor: number | null = null;
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
